/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
import { AlertCircle, Mail, Search, Send, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

type SendStatus = null | { type: string; message: string; details?: any };
export default function AdminNewsletterPanel() {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: '',
    htmlContent: '',
    textContent: '',
  });
  const [sendStatus, setSendStatus] = useState<SendStatus>(null);

  useEffect(() => {
    if (searchTerm) {
      setFilteredEmails(
        emails.filter((e: any) =>
          e.email.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    } else {
      setFilteredEmails(emails);
    }
  }, [searchTerm, emails]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter');
      if (response.ok) {
        const data = await response.json();
        setEmails(data);
        setFilteredEmails(data);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmails();
  }, []);

  const deleteEmail = async (id: string) => {
    try {
      const response = await fetch(`/api/newsletter/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEmails(emails.filter((e: any) => e.id !== id));
      }
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const sendNewsletter = async () => {
    setLoading(true);
    setSendStatus(null);

    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm),
      });

      const result = await response.json();

      if (response.ok) {
        setSendStatus({
          type: 'success',
          message: `Отправлено: ${result.sent} из ${result.total}`,
          details: result,
        });
        setEmailForm({ subject: '', htmlContent: '', textContent: '' });
        setTimeout(() => setShowSendModal(false), 2000);
      } else {
        setSendStatus({
          type: 'error',
          message: result.error || 'Ошибка отправки',
        });
      }
    } catch {
      setSendStatus({
        type: 'error',
        message: 'Ошибка при отправке рассылки',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
                <Mail className="h-8 w-8 text-indigo-600" />
                Управление рассылкой
              </h1>
              <p className="mt-1 text-gray-600">
                Всего подписчиков:
                {' '}
                {emails.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSendModal(true)}
              disabled={emails.length === 0}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
              Отправить рассылку
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {loading && !showSendModal
            ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                </div>
              )
            : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Дата подписки
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredEmails.map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {item.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => deleteEmail(item.id)}
                              className="text-red-600 transition-colors hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredEmails.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                      {searchTerm ? 'Ничего не найдено' : 'Нет подписчиков'}
                    </div>
                  )}
                </div>
              )}
        </div>
      </div>

      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4 opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold">Отправить рассылку</h2>

            {sendStatus && (
              <div className={`mb-4 rounded-lg p-4 ${
                sendStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>{sendStatus.message}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <p className="mb-1 block text-sm font-medium text-gray-700">
                  Тема письма
                </p>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Введите тему письма"
                />
              </div>

              <div>
                <p className="mb-1 block text-sm font-medium text-gray-700">
                  HTML содержание
                </p>
                <textarea
                  value={emailForm.htmlContent}
                  onChange={e => setEmailForm({ ...emailForm, htmlContent: e.target.value })}
                  className="h-48 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  placeholder="<h1>Ваше сообщение</h1>"
                />
              </div>

              <div>
                <p className="mb-1 block text-sm font-medium text-gray-700">
                  Текстовая версия (опционально)
                </p>
                <textarea
                  value={emailForm.textContent}
                  onChange={e => setEmailForm({ ...emailForm, textContent: e.target.value })}
                  className="h-24 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Текстовая версия для почтовых клиентов без HTML"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={sendNewsletter}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                          Отправка...
                        </>
                      )
                    : (
                        <>
                          <Send className="h-4 w-4" />
                          Отправить всем (
                          {emails.length}
                          )
                        </>
                      )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSendModal(false);
                    setSendStatus(null);
                  }}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-6 py-2 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
