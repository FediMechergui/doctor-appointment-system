
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface AppointmentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const AppointmentFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: AppointmentFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <div className="relative flex-1">
        <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-48">
        <Select 
          value={statusFilter}
          onValueChange={onStatusFilterChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="à venir">À venir</SelectItem>
            <SelectItem value="terminé">Terminés</SelectItem>
            <SelectItem value="annulé">Annulés</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AppointmentFilters;
