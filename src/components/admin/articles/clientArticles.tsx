// src/components/admin/articles/clientArticles.tsx
'use client';

import type {
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import type { Article } from '@/models/article';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useArticles, useDeleteArticle } from '@/queries/useArticles';
import { useArticleModal } from '@/stores/useArticleStore';
import ArticleModal from './ArticleModal';

export default function ClientArticles() {
  const { data: articles, isLoading, error } = useArticles();
  const deleteMutation = useDeleteArticle();
  const { openModal } = useArticleModal();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const columns = useMemo<ColumnDef<Article>[]>(
    () => [
      {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ getValue }) => {
          const image = getValue() as string;
          return image
            ? (
                <Image
                  width={64}
                  height={64}
                  src={image}
                  alt="Article"
                  className="h-16 w-16 rounded object-cover"
                />
              )
            : (
                <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-200 text-xs text-gray-400">
                  No image
                </div>
              );
        },
        enableSorting: false,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ getValue }) => (
          <div className="max-w-xs truncate font-medium">{getValue() as string}</div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ getValue }) => {
          const type = getValue() as string;
          return (
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                type === 'news'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          );
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ getValue }) => {
          const isActive = getValue() as boolean;
          return (
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {isActive ? 'Active' : 'Inactive'}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return (
            <span className="text-sm text-gray-600">
              {date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const article = row.original;
          return (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => openModal(article.id)}
                className="cursor-pointer rounded px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(article.id)}
                className="cursor-pointer rounded px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    [openModal],
  );

  const table = useReactTable({
    data: articles || [],
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          Error loading articles:
          {' '}
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles & News</h1>
          <p className="mt-1 text-gray-600">Manage your articles and news content</p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Article
        </button>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="border-b p-4">
          <input
            type="text"
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search articles..."
            className="w-full max-w-sm rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {isLoading
          ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                  <p className="text-gray-600">Loading articles...</p>
                </div>
              </div>
            )
          : articles?.length === 0
            ? (
                <div className="py-20 text-center">
                  <svg
                    className="mx-auto mb-4 h-16 w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mb-1 text-lg font-medium text-gray-900">
                    No articles yet
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Get started by creating your first article
                  </p>
                  <button
                    type="button"
                    onClick={() => openModal()}
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    Create Article
                  </button>
                </div>
              )
            : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                              <th
                                key={header.id}
                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                              >
                                {header.isPlaceholder
                                  ? null
                                  : (
                                      <div
                                        onKeyDown={header.column.getToggleSortingHandler()}
                                        role="button"
                                        tabIndex={0}
                                        className={
                                          header.column.getCanSort()
                                            ? 'flex cursor-pointer items-center gap-2 select-none'
                                            : ''
                                        }
                                        onClick={header.column.getToggleSortingHandler()}
                                      >
                                        {flexRender(
                                          header.column.columnDef.header,
                                          header.getContext(),
                                        )}
                                        {header.column.getCanSort() && (
                                          <span className="text-gray-400">
                                            {{
                                              asc: '↑',
                                              desc: '↓',
                                            }[header.column.getIsSorted() as string] ?? '↕'}
                                          </span>
                                        )}
                                      </div>
                                    )}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {table.getRowModel().rows.map(row => (
                          <tr key={row.id} className="hover:bg-gray-50">
                            {row.getVisibleCells().map(cell => (
                              <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between border-t px-6 py-4">
                    <div className="text-sm text-gray-700">
                      Showing
                      {' '}
                      {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                      {' '}
                      to
                      {' '}
                      {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length,
                      )}
                      {' '}
                      of
                      {' '}
                      {table.getFilteredRowModel().rows.length}
                      {' '}
                      results
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
      </div>

      <ArticleModal />

      {deleteConfirm && (
        <div
          onKeyUp={e => e.key === 'Escape' && setDeleteConfirm(null)}
          role="button"
          tabIndex={0}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setDeleteConfirm(null)}
        >
          <button
            type="button"
            className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-semibold">Delete Article</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteMutation.isPending}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                Delete
              </button>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
