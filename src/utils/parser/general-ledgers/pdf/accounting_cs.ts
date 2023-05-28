import type {
  AnalyzeResult,
  AnalyzedDocument,
} from "@azure/ai-form-recognizer";
import type { Account } from "~/types/account";

export function parseGeneralLedgerFormRecognizerResult_AccountingCS(
  result: AnalyzeResult<AnalyzedDocument>
): Account[] | void {
  const accounts: Account[] = [];
  let curAccountName: string | undefined, curAccountNumber: string | undefined;

  const { tables } = result;
  if (!tables) return accounts;

  for (const table of tables) {
    let contentStartsAt: number | undefined;
    let dateColumnIndex: number | undefined,
      descriptionColumnIndex: number | undefined,
      beginningBalanceColumnIndex: number | undefined,
      amountColumnIndex: number | undefined;

    // Initialize column headers
    for (const [index, cell] of table.cells.entries()) {
      if (cell.kind === "columnHeader") {
        // Find column headers of interest
        if (cell.content.includes("Date")) dateColumnIndex = cell.columnIndex;
        if (cell.content.includes("Description"))
          descriptionColumnIndex = cell.columnIndex;
        if (cell.content.includes("Beginning Balance"))
          beginningBalanceColumnIndex = cell.columnIndex;
        if (cell.content.includes("Amount"))
          amountColumnIndex = cell.columnIndex;
      } else {
        contentStartsAt = index;
        break;
      }
    }

    // Ensure all column headers are present
    if (
      dateColumnIndex === undefined ||
      descriptionColumnIndex === undefined ||
      beginningBalanceColumnIndex === undefined ||
      amountColumnIndex === undefined
    ) {
      console.error(
        "Missing one or more column headers: ",
        {
          dateColumnIndex,
          descriptionColumnIndex,
          beginningBalanceColumnIndex,
          amountColumnIndex,
        },
        "table info: ",
        {
          rows: table.rowCount,
          columns: table.columnCount,
          cells: table.cells.length,
          spans: table.spans,
        }
      );
      curAccountName = undefined;
      curAccountNumber = undefined;
      continue;
    }

    // Ensure we found the start of the content
    if (!contentStartsAt) {
      console.error("Could not find start of content");
      break;
    }

    // Loop through each cell
    for (let i = contentStartsAt; i < table.cells.length; i++) {
      const cell = table.cells[i];
      if (!cell) continue;

      const { rowIndex, columnIndex } = cell;

      if (columnIndex === dateColumnIndex) {
        // Dates are formatted as "MM/DD/YY"
        const date = cell.content;
        if (!date) continue;

        // Ensure the date is valid using regex
        const dateRegex = /^\d{2}\/\d{2}\/\d{2}$/;
        if (!dateRegex.test(date)) {
          // Ensure the footer is not included
          if (cell.content.includes("Printed by")) break;

          // Prevent totals from being included
          if (cell.content.includes("Totals for")) {
            curAccountName = undefined;
            curAccountNumber = undefined;
            break;
          }

          // Make sure we don't include the summary section of the general ledger
          if (
            cell.content.includes("Net Profit") ||
            cell.content.includes("(Loss)")
          ) {
            curAccountName = undefined;
            curAccountNumber = undefined;
            break;
          }
          if (
            cell.content.includes("Current Period") ||
            cell.content.includes("Year-to-Date")
          ) {
            curAccountName = undefined;
            curAccountNumber = undefined;
            break;
          }

          // When the date is invalid, we can assume that this is the title of the next account
          curAccountName = cell.content;

          // If the next cell is not the next row, we need to combine the account name (unless we find another invalid cell)
          let curRowIndex = rowIndex;
          while (curRowIndex === rowIndex) {
            const nextCell = table.cells[i + 1];
            if (!nextCell) break;
            curRowIndex = nextCell.rowIndex;

            if (curRowIndex !== rowIndex) break;
            if (nextCell.content.includes("Totals for")) break;
            if (nextCell.columnIndex === beginningBalanceColumnIndex) break;

            curAccountName += ` ${nextCell.content}`;
            i++;
          }

          // Remove newlines and trim whitespace
          curAccountName = curAccountName.replaceAll("\n", " ").trim();

          // Split the account name and number
          curAccountNumber = curAccountName.split(" ")[0];
          curAccountName = curAccountName.split(" ").slice(1).join(" ");

          // Ensure the account name and number are valid
          if (!curAccountName || !curAccountNumber) {
            console.error(
              `Could not parse account name or number: ${cell.content} (NAME: ${
                curAccountName ?? "undefined"
              }, NUMBER: ${curAccountNumber ?? "undefined"})"}))`
            );
            continue;
          }

          // Add the account to the list
          accounts.push({
            name: curAccountName,
            number: curAccountNumber,
            entries: [],
          });
          continue;
        }

        // If the date is valid, we assume that this is an entry
        let curRowIndex = rowIndex,
          description: string | undefined,
          amountStr: string | undefined;
        while (curRowIndex === rowIndex) {
          const nextCell = table.cells[i + 1];
          if (!nextCell) break;
          curRowIndex = nextCell.rowIndex;

          if (curRowIndex !== rowIndex) break;
          if (nextCell.columnIndex === descriptionColumnIndex)
            description = nextCell.content;
          if (nextCell.columnIndex === amountColumnIndex)
            amountStr = nextCell.content;
          if (description && amountStr) break;
          i++;
        }

        // Ensure the description and amount are valid
        if (!description || !amountStr || description.includes("Totals for")) {
          console.error(
            `Could not parse description or amount: description: ${
              description ?? "undefined"
            }, amount: ${amountStr ?? "undefined"}`
          );

          // Move to the next cell
          continue;
        }

        // Check if the next row is empty besides the description column, if so, it is an extension
        // of the current entry description, so we need to combine them:

        // Save the current cell index
        const curCellIndex = i;

        // Get the next row
        while (i < table.cells.length) {
          const nextCell = table.cells[i + 1];
          if (!nextCell) break;

          if (nextCell.rowIndex !== rowIndex) break;
          i++;
        }

        // Get the next row's cells
        const nextRow = [];
        while (i < table.cells.length) {
          const nextCell = table.cells[i + 1];
          if (!nextCell) break;

          nextRow.push(nextCell);

          if (nextCell.rowIndex !== rowIndex + 1) break;
          i++;
        }

        // Reset the cell index (done after getting the next row's cells)
        i = curCellIndex;

        // Check if the next row is empty besides the description column
        const nextRowEmpty = nextRow.every(
          (cell) =>
            (cell.columnIndex === descriptionColumnIndex &&
              cell.content.trim()) ||
            (cell.columnIndex !== descriptionColumnIndex &&
              !cell.content.trim())
        );

        // If the next row is empty, combine the descriptions
        if (nextRowEmpty)
          description += ` ${
            nextRow.find((cell) => cell.columnIndex === descriptionColumnIndex)
              ?.content ?? ""
          }`;

        // Remove newlines and trim whitespace
        description = description.replaceAll("\n", " ").trim();

        // Make parenthesis negative, remove commas, & convert to number
        // const amount = Number(
        //   amountStr.replaceAll("(", "-").replaceAll(")", "").replaceAll(",", "")
        // );

        // First try to find an existing entry in the same account, with the same description
        const existingEntry = accounts[accounts.length - 1]?.entries.find(
          (entry) => entry.description === description
        );

        // If the entry exists, increment the quantity
        if (existingEntry) {
          existingEntry.quantity++;
          continue;
        }

        // Add the entry to the account (if there is not an existing entry)
        accounts[accounts.length - 1]?.entries.push({
          description,
          quantity: 1,
        });
      }
    }
  }

  return accounts;
}
