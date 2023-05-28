import type {
  AnalyzeResult,
  AnalyzedDocument,
} from "@azure/ai-form-recognizer";
import type { Transaction } from "~/types/transaction";

export function parseBankStatementFormRecognizerResult_BofaBusiness(
  result: AnalyzeResult<AnalyzedDocument>
): Transaction[] | void {
  const transactions: Transaction[] = [];

  const { tables } = result;
  if (!tables) return transactions;

  for (const table of tables) {
    let contentStartsAt: number | undefined;
    let dateColumnIndex: number | undefined,
      descriptionColumnIndex: number | undefined,
      amountColumnIndex: number | undefined;

    // Initialize column headers
    for (const [index, cell] of table.cells.entries()) {
      if (cell.kind === "columnHeader") {
        // Find column headers of interest
        if (cell.content.includes("Date")) dateColumnIndex = cell.columnIndex;
        if (cell.content.includes("Description"))
          descriptionColumnIndex = cell.columnIndex;
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
      amountColumnIndex === undefined
    ) {
      console
        .error
        // "Missing one or more column headers: "
        // ,
        // {
        //   dateColumnIndex,
        //   descriptionColumnIndex,
        //   amountColumnIndex,
        // },
        // "table info: ",
        // {
        //   rows: table.rowCount,
        //   columns: table.columnCount,
        //   cells: table.cells.length,
        //   spans: table.spans,
        // }
        ();
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
          continue;
        }

        // If the date is valid, we assume that this is a transaction
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

        // Remove newlines and trim whitespace
        description = description.replaceAll("\n", " ").trim();

        // Ensure the description is valid
        if (!description) {
          console.error(`Could not parse description: ${description}`);
          continue;
        }

        // Remove commas, & convert to number
        const amount = Number(amountStr.replaceAll(",", ""));

        // Ensure the amount is valid
        if (isNaN(amount)) {
          console.error(`Could not parse amount: ${amountStr}`);
          continue;
        }

        transactions.push({ date, description, amount });
      }
    }
  }

  return transactions;
}
