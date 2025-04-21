
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataPreviewTableProps {
  headers: string[];
  previewData: any[];
}

const DataPreviewTable = ({ headers, previewData }: DataPreviewTableProps) => (
  <div>
    <h3 className="font-semibold mb-3">Aperçu des données</h3>
    <ScrollArea className="h-72 rounded-md border">
      <div className="w-max min-w-full">
        <Table>
          <TableHeader className="bg-noir-100 sticky top-0 z-10">
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="whitespace-nowrap">{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header, cellIndex) => (
                  <TableCell key={cellIndex} className="whitespace-nowrap">{row[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  </div>
);

export default DataPreviewTable;
