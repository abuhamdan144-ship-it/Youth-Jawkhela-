import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

table_component = """
import { ArrowUpDown } from 'lucide-react';

export type ColumnDef<T = any> = {
  header: string;
  accessorKey?: string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
};

export function AdminDataTable({
  collectionName,
  data,
  columns,
  titleField,
}: {
  collectionName: CollectionName;
  data: any[];
  columns: ColumnDef[];
  titleField: string;
}) {
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`p-4 font-medium whitespace-nowrap ${col.sortable && col.accessorKey ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''}`}
                onClick={() => col.sortable && col.accessorKey && handleSort(col.accessorKey)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && col.accessorKey && <ArrowUpDown size={14} className="opacity-50" />}
                </div>
              </th>
            ))}
            <th className="p-4 font-medium text-right whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="p-8 text-center text-gray-500">
                No records found.
              </td>
            </tr>
          ) : (
            sortedData.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-gray-50 transition-colors group">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="p-4 text-sm text-gray-700">
                    {col.cell ? col.cell(item) : col.accessorKey ? item[col.accessorKey] : null}
                  </td>
                ))}
                <td className="p-4 flex justify-end">
                  <AdminItemActions 
                    collectionName={collectionName} 
                    item={item} 
                    titleField={titleField} 
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
"""

if "export function AdminDataTable" not in code:
    code = code.replace("const AdminItemActions = ({ ", table_component + "\nconst AdminItemActions = ({ ")

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)

