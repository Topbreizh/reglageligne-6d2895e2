
import React from "react";
import { TableRow, TableHead } from "@/components/ui/table";

const ChampTableHeader: React.FC = () => (
  <TableRow>
    <TableHead className="w-12">Ordre</TableHead>
    <TableHead>Nom</TableHead>
    <TableHead>Nom technique</TableHead>
    <TableHead>Lignes applicables</TableHead>
    <TableHead>Visible</TableHead>
    <TableHead className="w-32">Actions</TableHead>
  </TableRow>
);

export default ChampTableHeader;
