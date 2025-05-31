import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send, Trash2 } from 'lucide-react';

interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  receiverType: string;
  content: string;
  createdTime: string;
  isRead: boolean;
}

interface ApiResponse<T> {
  data: T;
  additionalData: any;
  message: string | null;
  statusCode: number;
  code: string;
}

interface ErrorResponse {
  data?: any;
  additionalData?: any;
  message?: string;
  statusCode?: number;
  code?: string;
  detail?: string;
  errors?: any;
}

const ProviderMessages = () => {
  const { user, token } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    if (!user?._id) {
      setError('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/api/Message/conversations/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData: ApiResponse<Conversation[]> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy danh sách hội thoại');
      }

      setConversations(responseData.data || []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy danh sách hội thoại';
        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi lấy danh sách hội thoại. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => navigate('/provider/login'), 2000);
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi lấy danh sách hội thoại');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (selectedUserId: string) => {
    if (!user?._id) {
      setError('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/api/Message/thread', {
        headers: { Authorization: `Bearer ${token}` },
        params: { user1Id: user._id, user2Id: selectedUserId },
      });

      const responseData: ApiResponse<Message[]> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy đoạn hội thoại');
      }

      setMessages(responseData.data || []);

      const unreadMessages = responseData.data.filter(msg => !msg.isRead && msg.senderId !== user._id);
      for (const msg of unreadMessages) {
        await markMessageAsRead(msg.id);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy đoạn hội thoại';
        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi lấy đoạn hội thoại. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi lấy đoạn hội thoại');
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedUserId || !newMessage.trim()) {
      setError('Vui lòng chọn người nhận và nhập nội dung tin nhắn');
      return;
    }

    if (!token || !user?._id) {
      setError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const payload = {
        receiverId: selectedUserId,
        receiverType: 'Customer', // Giả định, cần kiểm tra backend nếu yêu cầu khác
        content: newMessage.trim(),
      };

      console.log('Payload gửi lên API /api/Message/send:', payload);

      const response = await axiosInstance.post('/api/Message/send', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData: ApiResponse<Message> = response.data;
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(responseData.message || 'Lỗi khi gửi tin nhắn');
      }

      setNewMessage('');
      setSuccess('Gửi tin nhắn thành công');
      fetchMessages(selectedUserId);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi gửi tin nhắn';
        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi gửi tin nhắn. Vui lòng kiểm tra log backend tại beautyspaapi20250516125713-h6h7bee3h7gyenhy.canadacentral-01.azurewebsites.net hoặc liên hệ quản trị viên.';
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => navigate('/provider/login'), 2000);
        } else if (axiosError.response?.status === 400) {
          errorMessage = axiosError.response?.data?.detail || 'Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra nội dung tin nhắn và thử lại.';
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi gửi tin nhắn. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const response = await axiosInstance.patch(`/api/Message/read/${messageId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData: ApiResponse<any> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi đánh dấu tin nhắn đã đọc');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        console.error('Lỗi khi đánh dấu tin nhắn đã đọc:', axiosError.response?.data?.message);
      }
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.delete(`/api/Message/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData: ApiResponse<any> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi xóa tin nhắn');
      }

      setSuccess('Xóa tin nhắn thành công');
      if (selectedUserId) {
        fetchMessages(selectedUserId);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi xóa tin nhắn';
        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi xóa tin nhắn. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi xóa tin nhắn');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [token, user]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  return (
    <div className="p-8 flex h-screen bg-gray-100">
      {/* Danh sách hội thoại */}
      <div className="w-1/4 bg-white shadow-lg p-6 rounded-l-xl border-r border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách hội thoại</h2>
        {loading ? (
          <p className="text-gray-500 italic">Đang tải...</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có hội thoại nào</p>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <div
                key={conversation.userId}
                onClick={() => setSelectedUserId(conversation.userId)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                  selectedUserId === conversation.userId ? 'bg-blue-100 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{conversation.userName.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{conversation.userName}</p>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(conversation.lastMessageTime).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Khu vực hội thoại */}
      <div className="w-3/4 bg-white p-6 rounded-r-xl shadow-lg flex flex-col">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        {selectedUserId ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Hội thoại với {conversations.find(c => c.userId === selectedUserId)?.userName}
            </h2>
            <div className="flex-1 overflow-y-auto mb-6 p-4 bg-gray-50 rounded-lg shadow-inner">
              {messages.length === 0 ? (
                <p className="text-gray-500 italic text-center">Chưa có tin nhắn nào</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.senderId !== user?._id && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-semibold">
                            {conversations.find(c => c.userId === selectedUserId)?.userName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div
                        className={`max-w-sm p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg ${
                          message.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {new Date(message.createdTime).toLocaleString()}
                        </p>
                        <div className="flex justify-end space-x-2 mt-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMessage(message.id)}
                            disabled={loading}
                            className="flex items-center space-x-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Xóa</span>
                          </Button>
                        </div>
                      </div>
                      {message.senderId === user?._id && (
                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{user?.name?.charAt(0) || 'P'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex space-x-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg shadow-sm"
              />
              <Button
                onClick={sendMessage}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-2 rounded-lg shadow-md"
              >
                <Send className="w-5 h-5" />
                <span>Gửi</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 italic">Chọn một hội thoại để bắt đầu nhắn tin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderMessages;