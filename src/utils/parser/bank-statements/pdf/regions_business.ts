import type {
  AnalyzeResult,
  AnalyzedDocument,
  DocumentLine,
} from "@azure/ai-form-recognizer";
import type { Transaction } from "~/types/transaction";

export function parseBankStatementFormRecognizerResult_RegionsBusiness(
  result: AnalyzeResult<AnalyzedDocument>
): Transaction[] | void {
  // To parse this:
  // Note: Regions does not parse the tables correctly, so we have to do it manually
  // Note: polygons have their points ordered clockwise (top left, top right, bottom right, bottom left), the lengthUnit is inches
  // 1. Find the "WITHDRAWALS" line (pages[i] -> lines[j] -> content)

  const transactions: Transaction[] = [];

  const { pages } = result;
  if (!pages) return transactions;

  // Start by looking for the "WITHDRAWALS" line
  for (const page of pages) {
    if (!page?.lines) continue;

    // Mark the beginning of the withdrawals section
    const withdrawalsLine = page.lines.find((line) =>
      line?.content?.startsWith("WITHDRAWALS")
    );
    if (!withdrawalsLine) continue;
    const totalWithdrawalsLine = page.lines.find((line) =>
      line?.content?.startsWith("Total Withdrawals")
    );

    // This array will hold all the lines that are part of the withdrawal transactions section
    const unsortedTransactionLines: DocumentLine[] = [];

    // Now that we have the withdrawals line, we can start parsing the transactions
    for (const line of page.lines.slice(page.lines.indexOf(withdrawalsLine))) {
      if (!line.content || !line.polygon) continue;
      const { content, polygon } = line;
      if (!polygon[0] || !polygon[1] || !polygon[2] || !polygon[3]) continue;

      // If the current line's polyon y is greater than (or equal) the total withdrawals line's polygon y, then we've reached the end of the withdrawals section
      if (
        totalWithdrawalsLine?.polygon?.[0] &&
        polygon[0].y >= totalWithdrawalsLine.polygon[0]?.y * 0.99 // We are multiplying by 0.99 to ensure the total amount is not included
      )
        continue;

      // If the current line's polygon y is less than (or equal) the withdrawals line's polygon y, don't record it
      if (
        withdrawalsLine?.polygon?.[0] &&
        polygon[0].y <= withdrawalsLine.polygon[0]?.y
      )
        continue;

      unsortedTransactionLines.push(line);

      // Stop parsing when we find these lines
      if (content.startsWith("CHECKS")) break;
      if (content.startsWith("You may request account disclosures containing"))
        break;
    }

    // Now that we have the lines that are part of the withdrawal transactions section, we can start parsing the transactions
    // First, we need to sort the lines by their y value
    unsortedTransactionLines.sort((a, b) => {
      if (!a.polygon || !b.polygon) return 0;
      if (!a.polygon[0] || !b.polygon[0]) return 0;
      if (!a.polygon[0].y || !b.polygon[0].y) return 0;
      return a.polygon[0].y - b.polygon[0].y;
    });

    // Now we are going to chunk the lines, where each new chunk starts with a line that has a "DATE" in it
    // by running a regex check for xx/xx (where x is a number)
    const transactionChunks: DocumentLine[][] = [];
    let currentChunk: DocumentLine[] = [];
    for (const line of unsortedTransactionLines) {
      if (!line.content) continue;
      if (line.content.match(/\d{2}\/\d{2}/)) {
        // If the line has a date in it, start a new chunk
        currentChunk = [line];
        transactionChunks.push(currentChunk);
      } else {
        // If the line does not have a date in it, add it to the current chunk
        currentChunk.push(line);
      }
    }

    // Now, sort each chunk by their x value
    for (const chunk of transactionChunks) {
      chunk.sort((a, b) => {
        if (!a.polygon || !b.polygon) return 0;
        if (!a.polygon[0] || !b.polygon[0]) return 0;
        if (!a.polygon[0].x || !b.polygon[0].x) return 0;
        return a.polygon[0].x - b.polygon[0].x;
      });
    }

    // Now, we can parse each chunk into a transaction
    // The first index of each chunk is the date, the last is the amount, and the rest is the description (joined by spaces)
    for (const chunk of transactionChunks) {
      if (!chunk[0]?.content || !chunk[chunk.length - 1]?.content) continue;
      const date = chunk[0].content;
      const amount = chunk[chunk.length - 1]?.content || "0";
      const description = chunk
        .slice(1, chunk.length - 1)
        .map((line) => line.content)
        .join(" ");

      // Convert the amount to a number (remove commas)
      const amountNumber = Number(amount.replace(/,/g, ""));
      if (isNaN(amountNumber)) {
        console.error(
          `Failed to convert amount to number: ${amount} (${amount.replace(
            /,/g,
            ""
          )})`
        );
        continue;
      }

      transactions.push({
        date,
        description,
        amount: amountNumber * -1, // Withdrawals are negative
      });
    }

    return transactions;
  }
}
