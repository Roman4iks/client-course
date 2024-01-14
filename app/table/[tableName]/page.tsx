import { Table } from '@/components/ui/table';
import { MyTableBody } from '@/components/ui/MyTableBody';

const TablePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="overflow-hidden bg-white shadow-md rounded-lg">
        <Table className="min-w-full table-auto">
          <MyTableBody />
        </Table>
      </div>
    </div>
  );
};

export default TablePage;
