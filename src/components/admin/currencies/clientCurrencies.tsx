/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable tailwindcss/no-custom-classname */
'use client';

import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';
import type { Currency } from '@/models/currency';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import {
  useCreateCurrency,
  useCurrenciesAdmin,
  useDeleteCurrency,
  useUpdateCurrency,
} from '@/queries/useCurrencies';

type CurrencyModalStore = {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedCurrency: Currency | null;
  openAddModal: () => void;
  openEditModal: (currency: Currency) => void;
  openDeleteModal: (currency: Currency) => void;
  closeAllModals: () => void;
};

const useCurrencyModalStore = create<CurrencyModalStore>(set => ({
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  selectedCurrency: null,
  openAddModal: () => set({ isAddModalOpen: true }),
  openEditModal: currency => set({ isEditModalOpen: true, selectedCurrency: currency }),
  openDeleteModal: currency => set({ isDeleteModalOpen: true, selectedCurrency: currency }),
  closeAllModals: () => set({
    isAddModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    selectedCurrency: null,
  }),
}));

type CurrencyFormData = {
  code: string;
  name: string;
  rateToZL: string;
  imageUrl: string;
  reserve: string;
  isBase: boolean;
  isActive: boolean;
};

const ActionButtons = ({ currency }: { currency: Currency }) => {
  const { openEditModal, openDeleteModal } = useCurrencyModalStore();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => openEditModal(currency)}
        className="cursor-pointer rounded px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => openDeleteModal(currency)}
        className="cursor-pointer rounded px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
      >
        Delete
      </button>
    </div>
  );
};

const TableHeader = ({ count, onAddClick }: { count: number; onAddClick: () => void }) => (
  <div className="border-b border-gray-200 px-6 py-5">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Currency Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Total currencies:
          {count}
        </p>
      </div>
      <button
        type="button"
        onClick={onAddClick}
        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
      >
        + Add currency
      </button>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      <p className="text-gray-600">Loading currencies...</p>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-700">
      <p className="font-medium">Failed to load data</p>
      <p className="mt-1 text-sm">Try reloading the page</p>
    </div>
  </div>
);

function CurrencyModal({
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (data: CurrencyFormData) => Promise<void>;
  initialData?: Currency;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<CurrencyFormData>({
    code: initialData?.code || '',
    name: initialData?.name || '',
    rateToZL: initialData?.rateToZL?.toString() || '',
    imageUrl: initialData?.imageUrl || '',
    reserve: initialData?.reserve?.toString() || '',
    isBase: initialData?.isBase || false,
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onSubmit(formData);
    },
    [formData, onSubmit],
  );

  const updateField = useCallback(
    <K extends keyof CurrencyFormData>(field: K, value: CurrencyFormData[K]) => {
      setFormData((prev) => {
        if (field === 'isBase' && value === true) {
          return { ...prev, isBase: true, rateToZL: '1' };
        }
        return { ...prev, [field]: value };
      });
    },
    [],
  );

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          {initialData ? 'Edit currency' : 'Add currency'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Currency code *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={e => updateField('code', e.target.value.toUpperCase())}
              className={`w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                initialData ? 'cursor-not-allowed bg-gray-100' : ''
              }`}
              required
              disabled={!!initialData}
              maxLength={10}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Rate to ZL
              {' '}
              {!formData.isBase && '*'}
            </label>
            <input
              type="number"
              step="0.000001"
              value={formData.rateToZL}
              onChange={e => updateField('rateToZL', e.target.value)}
              className={`w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                formData.isBase ? 'cursor-not-allowed bg-gray-100' : ''
              }`}
              required={!formData.isBase}
              disabled={formData.isBase}
            />
            {formData.isBase && (
              <p className="mt-1 text-xs text-gray-500">
                Base currency always has rate 1.0
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={e => updateField('imageUrl', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Reserve
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.reserve}
              onChange={e => updateField('reserve', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isBase}
                onChange={e => updateField('isBase', e.target.checked)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Base currency</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={e => updateField('isActive', e.target.checked)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({
  onClose,
  onConfirm,
  currencyName,
  isLoading,
}: {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  currencyName: string;
  isLoading: boolean;
}) {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Delete confirmation
        </h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete currency
          {' '}
          <strong>{currencyName}</strong>
          ?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClientCurrencies() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const modalStore = useCurrencyModalStore();
  const { data: currencies, isLoading, error } = useCurrenciesAdmin();
  const createMutation = useCreateCurrency();
  const updateMutation = useUpdateCurrency();
  const deleteMutation = useDeleteCurrency();

  // Memoized columns to avoid recreation
  const columns = useMemo<ColumnDef<Currency>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => (
          <div className="font-semibold text-gray-900">{row.getValue('code')}</div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div className="text-gray-700">{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'rateToZL',
        header: 'Rate to ZL',
        cell: ({ row }) => {
          const rate = Number.parseFloat(row.getValue('rateToZL'));
          return <div className="text-gray-700">{rate.toFixed(6)}</div>;
        },
      },
      {
        accessorKey: 'reserve',
        header: 'Reserve',
        cell: ({ row }) => {
          const reserve = row.getValue('reserve') as number | null;
          return (
            <div className="text-gray-700">
              {reserve !== null ? reserve.toLocaleString() : '—'}
            </div>
          );
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              row.getValue('isActive')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {row.getValue('isActive') ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        accessorKey: 'isBase',
        header: 'Base',
        cell: ({ row }) => (
          <div className="text-center">
            {row.getValue('isBase')
              ? (
                  <span className="font-medium text-blue-600">✓</span>
                )
              : (
                  <span className="text-gray-300">—</span>
                )}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionButtons currency={row.original} />,
      },
    ],
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: currencies || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleCreate = useCallback(
    async (data: CurrencyFormData) => {
      const payload = {
        code: data.code.toUpperCase(),
        name: data.name,
        rateToZL: data.isBase ? 1 : Number.parseFloat(data.rateToZL),
        imageUrl: data.imageUrl || undefined,
        reserve: data.reserve ? Number.parseFloat(data.reserve) : undefined,
        isBase: data.isBase,
        isActive: data.isActive,
      };

      try {
        await createMutation.mutateAsync(payload);
        toast.success('Currency added successfully');
        modalStore.closeAllModals();
      } catch (error: any) {
        toast.error(error?.message || 'Error creating currency');
      }
    },
    [createMutation, modalStore],
  );

  const handleUpdate = useCallback(
    async (data: CurrencyFormData) => {
      if (!modalStore.selectedCurrency) {
        return;
      }

      const payload = {
        name: data.name,
        rateToZL: data.isBase ? 1 : Number.parseFloat(data.rateToZL),
        imageUrl: data.imageUrl || undefined,
        reserve: data.reserve ? Number.parseFloat(data.reserve) : undefined,
        isBase: data.isBase,
        isActive: data.isActive,
      };

      try {
        await updateMutation.mutateAsync({
          id: modalStore.selectedCurrency.id,
          data: payload,
        });
        toast.success('Currency updated successfully');
        modalStore.closeAllModals();
      } catch (error: any) {
        toast.error(error?.message || 'Error updating currency');
      }
    },
    [updateMutation, modalStore],
  );

  const handleDelete = useCallback(async () => {
    if (!modalStore.selectedCurrency) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(modalStore.selectedCurrency.id);
      toast.success('Currency deleted successfully');
      modalStore.closeAllModals();
    } catch (error: any) {
      toast.error(error?.message || 'Error deleting currency');
    }
  }, [deleteMutation, modalStore]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="max-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg bg-white shadow-sm">
          <TableHeader
            count={currencies?.length || 0}
            onAddClick={modalStore.openAddModal}
          />

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors hover:bg-gray-100"
                        onClick={header.column.getToggleSortingHandler()}
                        style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getIsSorted() && (
                            <span>
                              {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="transition-colors hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {currencies?.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">No currencies found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalStore.isAddModalOpen && (
        <CurrencyModal
          onClose={modalStore.closeAllModals}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      )}

      {modalStore.isEditModalOpen && modalStore.selectedCurrency && (
        <CurrencyModal
          onClose={modalStore.closeAllModals}
          onSubmit={handleUpdate}
          initialData={modalStore.selectedCurrency}
          isLoading={updateMutation.isPending}
        />
      )}

      {modalStore.isDeleteModalOpen && modalStore.selectedCurrency && (
        <DeleteModal
          onClose={modalStore.closeAllModals}
          onConfirm={handleDelete}
          currencyName={modalStore.selectedCurrency.name}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
