'use client';
import { X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '@/components/common/loader';
import HtmlEditor from '@/components/HtmlEditor';
import { useGetHistory, useGetSubscribers, useSendNewsletter, useUnsubscribeUser } from '@/queries/useNewsletter';

export default function NewsletterPage() {
  const { data: subscribersData, isLoading: subscribersLoading } = useGetSubscribers();
  const { data: historyData, isLoading: historyLoading, refetch: refetchHistory } = useGetHistory();
  const { mutateAsync: sendNewsletter, isPending } = useSendNewsletter();
  const { mutateAsync: unsubscribeUser } = useUnsubscribeUser();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('compose');

  if (subscribersLoading || historyLoading) {
    return <Loader />;
  }

  const handleSend = async () => {
    if (!subject || !content) {
      toast.error('Please fill in the subject and the email content');
      return;
    }

    // eslint-disable-next-line no-alert
    if (!confirm(`Send the newsletter to ${subscribersData?.data.subscribers.length} subscribers?`)) {
      return;
    }

    setLoading(true);
    try {
      await sendNewsletter(
        { subject, htmlContent: content },
        {
          onSuccess: () => {
            setSubject('');
            setContent('');
            refetchHistory();
          },
          onError: (data) => {
            toast.error(`Error: ${data.message}`);
          },
        },
      );
    } catch {
      toast.error('Failed to send the newsletter');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (id: string) => {
    try {
      await unsubscribeUser(id, {
        onSuccess: () => {
          refetchHistory();
          toast.success('User successfully unsubscribed');
        },
        onError: (data) => {
          toast.error(`Error: ${data.message}`);
        },
      });
      refetchHistory();
    } catch (error) {
      console.error('Error unsubscribing:', error);
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
          Create Newsletter
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
          Subscribers (
          {subscribersData
            && subscribersData?.data
            && subscribersData?.data.subscribers
            && subscribersData?.data.subscribers.length > 0
            && subscribersData?.data.subscribers.length
            ? subscribersData?.data.subscribers.length
            : '0'}
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
          History
        </button>
      </div>

      {activeTab === 'compose' && (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4">
            <p className="mb-2 block text-sm font-medium">
              Email Subject
            </p>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email subject..."
            />
          </div>

          <div className="mb-4">
            <p className="mb-2 block text-sm font-medium">
              Content (HTML)
            </p>
            <HtmlEditor
              value={content}
              onChangeAction={e => setContent(e)}

            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Recipients:
              {' '}
              <strong>
                {subscribersData
                  && subscribersData?.data
                  && subscribersData?.data.subscribers
                  && subscribersData?.data.subscribers.length > 0
                  && subscribersData?.data.subscribers.length
                  ? subscribersData?.data.subscribers.length
                  : '0'}
              </strong>
              {' '}
              subscribers
            </p>
            <button
              onClick={handleSend}
              type="button"
              disabled={loading || !subject || !content || subscribersData?.data.subscribers.length === 0}
              className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading || isPending ? 'Sending...' : 'Send Newsletter'}
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
                  Subscription Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subscription Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribersData
                && subscribersData?.data
                && subscribersData?.data.subscribers
                && subscribersData?.data.subscribers.length > 0
                && subscribersData?.data.subscribers.map((sub: any) => (
                  <tr key={sub.id}>
                    <td className="px-6 py-4 text-sm">{sub.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(sub.subscribedAt).toLocaleDateString('en-US')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(sub.subscribedAt).toLocaleTimeString('en-US')}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600">
                      <button
                        onClick={() => handleUnsubscribe(sub.id)}
                        type="button"
                        className="flex w-fit cursor-pointer self-center transition-opacity duration-300 hover:opacity-50"
                      >
                        <X />
                      </button>
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
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sent Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historyData
                && historyData?.data.history.length > 0
                && historyData?.data.history.map((newsletter: any) => (
                  <tr key={newsletter.id}>
                    <td className="px-6 py-4 text-sm">{newsletter.subject}</td>
                    <td className="px-6 py-4 text-sm">
                      {newsletter.recipientsCount}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`rounded px-2 py-1 text-xs uppercase ${
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
                        ? new Date(newsletter.sentAt).toLocaleString('en-US')
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
