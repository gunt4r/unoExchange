'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '@/components/common/loader';
import { useGetHistory, useGetSubscribers, useSendNewsletter } from '@/queries/useNewsletter';

export default function NewsletterPage() {
  const { data: subscribersData, isLoading: subscribersLoading } = useGetSubscribers();
  const { data: historyData, isLoading: historyLoading, refetch: refetchHistory } = useGetHistory();
  const { mutateAsync: sendNewsletter, isPending } = useSendNewsletter();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('compose');

  if (subscribersLoading || historyLoading) {
    return <Loader />;
  }

  const handleSend = async () => {
    if (!subject || !content) {
      toast.error('Заполните тему и содержание письма');
      return;
    }

    if (!confirm(`Отправить рассылку ${subscribersData?.data.subscribers.length} подписчикам?`)) {
      return;
    }

    setLoading(true);
    try {
      await sendNewsletter({ subject, htmlContent: content }, {
        onSuccess: () => {
          setSubject('');
          setContent('');
          refetchHistory();
        },
        onError: (data) => {
          toast.error(`Ошибка: ${data.message}`);
        },
      });
    } catch {
      toast.error('Не удалось отправить рассылку');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Newsletter Management</h1>

      <div className="mb-6 flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('compose')}
          type="button"
          className={`cursor-pointer px-4 pb-2 transition-opacity duration-300 hover:opacity-50 ${
            activeTab === 'compose'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Создать рассылку
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          type="button"
          className={`cursor-pointer px-4 pb-2 transition-opacity duration-300 hover:opacity-50 ${
            activeTab === 'subscribers'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Подписчики (
          {subscribersData?.data.subscribers.length}
          )
        </button>
        <button
          onClick={() => setActiveTab('history')}
          type="button"
          className={`cursor-pointer px-4 pb-2 transition-opacity duration-300 hover:opacity-50 ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          История
        </button>
      </div>

      {activeTab === 'compose' && (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4">
            <p className="mb-2 block text-sm font-medium">
              Тема письма
            </p>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Введите тему письма..."
            />
          </div>

          <div className="mb-4">
            <p className="mb-2 block text-sm font-medium">
              Содержание (HTML)
            </p>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 font-mono focus:ring-2 focus:ring-blue-500"
              rows={15}
              placeholder="<h1>Привет!</h1><p>Ваше сообщение здесь...</p>"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Получатели:
              {' '}
              <strong>{subscribersData?.data.subscribers.length}</strong>
              {' '}
              подписчиков
            </p>
            <button
              onClick={handleSend}
              type="button"
              disabled={loading || !subject || !content}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading || isPending ? 'Отправка...' : 'Отправить рассылку'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'subscribers' && (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Дата подписки
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribersData?.data.subscribers.map((sub: any) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 text-sm">{sub.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(sub.subscribedAt).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Тема
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Получатели
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Дата отправки
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historyData?.data.map((newsletter: any) => (
                <tr key={newsletter.id}>
                  <td className="px-6 py-4 text-sm">{newsletter.subject}</td>
                  <td className="px-6 py-4 text-sm">
                    {newsletter.recipientsCount}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        newsletter.status === 'sent'
                          ? 'bg-green-100 text-green-800'
                          : newsletter.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {newsletter.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {newsletter.sentAt
                      ? new Date(newsletter.sentAt).toLocaleString('ru-RU')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
