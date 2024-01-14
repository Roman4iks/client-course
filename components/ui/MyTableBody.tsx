'use client';
import React, { useEffect, useState } from 'react';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { usePathname } from 'next/navigation';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// ... (ваши импорты)

export const MyTableBody: React.FC = () => {
  const tableName = usePathname().split('/')[2];
  const [data, setData] = useState<Array<any>>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Количество записей на странице

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3300/api/${tableName}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [tableName]);

  const handleSort = (property: string) => {
    setSortBy(property);
    setSortOrder(prevSortOrder => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setCurrentPage(1); // Сбросить текущую страницу при изменении текста поиска
  };

  if (!data || data.length === 0) {
    return <h1>Loading</h1>;
  }

  const keys = Object.keys(data[0]);
  const filteredData = data.filter(item => {
    return keys.some(key => {
      const value = String(item[key]);
      return value.toLowerCase().includes(searchText.toLowerCase());
    });
  });

  // Рассчитать общее количество страниц
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Вычислить индекс начального и конечного элемента для текущей страницы
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Фильтрация, сортировка и разделение данных для текущей страницы
  const pagedData = filteredData
    .slice()
    .sort((a, b) => {
      const aValue = String(a[sortBy]);
      const bValue = String(b[sortBy]);

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    })
    .slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
        />
      </div>
      <TableHeader>
        <TableRow>
          {keys.map((key, index) => (
            <TableHead key={index} onClick={() => handleSort(key)}>
              <TableCell className="text-wrap">
                {key}
                {sortBy === key && (
                  <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </TableCell>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {pagedData.map((item, rowIndex) => (
          <TableRow key={rowIndex}>
            {keys.map((key, colIndex) => (
              <TableCell key={colIndex}>
                {item[key] ? item[key] : 'Null'}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <div>
        {/* Добавление пагинации */}
        <MyPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

// Дополнительный компонент для пагинации
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MyPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pagesArray = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  const renderPaginationButton = (page: number) => (
    <PaginationItem key={page}>
      <PaginationLink
        onClick={() => onPageChange(page)}
        isActive={currentPage === page}
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  );

  const renderSeparator = () => (
    <PaginationItem key="separator">
      <PaginationEllipsis />
    </PaginationItem>
  );

  const renderPaginationItems = () => {
    const visiblePages = 3;
    const halfVisiblePages = Math.floor(visiblePages / 2);

    if (totalPages <= visiblePages) {
      // All pages are visible
      return pagesArray.map(page => renderPaginationButton(page));
    }

    // Determine which pages are visible in the current range
    const startPage = Math.max(currentPage - halfVisiblePages, 1);
    const endPage = Math.min(currentPage + halfVisiblePages, totalPages);

    const visiblePagesArray = Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    );

    // Create buttons for visible pages and add separators
    let paginationItems: React.ReactNode[] = [];

    if (startPage > 1) {
      paginationItems.push(renderPaginationButton(1));
      if (startPage > 2) {
        paginationItems.push(renderSeparator());
      }
    }

    visiblePagesArray.forEach(page =>
      paginationItems.push(renderPaginationButton(page)),
    );

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationItems.push(renderSeparator());
      }
      paginationItems.push(renderPaginationButton(totalPages));
    }

    return paginationItems;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            isActive={currentPage === 1}
          />
        </PaginationItem>
        {renderPaginationItems()}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            isActive={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default MyPagination;
