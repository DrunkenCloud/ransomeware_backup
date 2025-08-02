import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "./ui/scroll-area";

interface QueryResultsProps {
  results: any[];
  columns: string[];
}

export function QueryResults({ results, columns }: QueryResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Query Results</CardTitle>
        <CardDescription>
          {results.length > 0 ? `Displaying ${results.length} rows.` : "No results to display. Run a query to see the data."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col} className="font-bold">{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length > 0 ? (
                results.map((row, rowIndex) => (
                  <TableRow key={row.id || rowIndex}>
                    {columns.map((col) => (
                      <TableCell key={`${row.id || rowIndex}-${col}`} className="font-code text-xs">
                        {String(row[col])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length || 1} className="h-24 text-center text-muted-foreground">
                    No results
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
