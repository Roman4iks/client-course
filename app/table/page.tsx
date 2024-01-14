import { Table, TableCaption } from '@/components/ui/table';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
      </Table>
    </main>
  );
}
