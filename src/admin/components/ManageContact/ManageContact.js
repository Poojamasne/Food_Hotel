// C:\Users\Admin\Desktop\Food Website demo\food-hotel-app\src\admin\components\ManageContact\ManageContact.js
import React, { useState, useEffect, useCallback } from 'react';
import './ManageContact.css';
import { 
  FaEye, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaSpinner, 
  FaRedo,
  FaEnvelope,
  FaUser,
  FaCalendar,
  FaFilter,
  FaSearch,
  FaReply,
  FaPhone,
  FaCommentDots
} from 'react-icons/fa';

const ManageContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    unread: 0,
    replied: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyData, setReplyData] = useState({
    subject: '',
    message: ''
  });

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('adminToken');
  };

  // Fetch contact messages from API
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = getToken();
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/contact/messages', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Contact messages API response:', data);
        
        if (data.success) {
          // Map the API response to our expected format
          const mappedMessages = data.data.map(msg => ({
            _id: msg.id,
            name: msg.name,
            email: msg.email,
            phone: msg.phone,
            subject: msg.subject,
            // Use message_preview for list view
            message_preview: msg.message_preview,
            // For full message, we'll fetch it when viewing details
            message: null, // Will be populated when viewing
            status: msg.status,
            created_at: msg.created_at
          }));
          
          console.log('Mapped messages:', mappedMessages);
          setMessages(mappedMessages);
        } else {
          setError(data.message || 'Failed to load messages');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `Error ${response.status}: Failed to fetch messages`);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch contact stats
  const fetchStats = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/contact/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data || {
            total: 0,
            read: 0,
            unread: 0,
            replied: 0
          });
        }
      } else {
        console.error('Error fetching stats:', response.status);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [fetchMessages, fetchStats]);

  // View message details
  const viewMessage = async (id) => {
    console.log('Viewing message with ID:', id);
    
    try {
      const token = getToken();
      if (!token) {
        alert('Authentication required');
        return;
      }

      // First fetch the full message details
      console.log('Fetching full message details...');
      const response = await fetch(`http://localhost:5000/api/contact/messages/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Message details response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Message details response:', data);
        
        if (data.success && data.data) {
          const fullMessage = data.data;
          console.log('Full message data:', fullMessage);
          
          // Mark as read
          try {
            await fetch(`http://localhost:5000/api/contact/messages/${id}/status`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ status: 'read' })
            });
            
            fullMessage.status = 'read';
          } catch (statusErr) {
            console.warn('Failed to mark as read:', statusErr);
          }
          
          // Map the response to our format
          const mappedMessage = {
            _id: fullMessage.id,
            name: fullMessage.name,
            email: fullMessage.email,
            phone: fullMessage.phone,
            subject: fullMessage.subject,
            message: fullMessage.message, // This should have the full message
            status: fullMessage.status || 'read',
            created_at: fullMessage.created_at,
            read_at: new Date().toISOString()
          };
          
          console.log('Mapped message for modal:', mappedMessage);
          
          setSelectedMessage(mappedMessage);
          setShowViewModal(true);
          
          // Update message in list
          setMessages(messages.map(msg => 
            msg._id === id ? { 
              ...msg, 
              status: 'read', 
              read_at: new Date().toISOString(),
              message: mappedMessage.message // Update with full message
            } : msg
          ));
          
          // Update stats
          fetchStats();
        } else {
          console.error('No message data in response:', data);
          alert(data.message || 'Failed to load message details');
        }
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert(`Error ${response.status}: Failed to load message`);
      }
    } catch (err) {
      console.error('Error viewing message:', err);
      alert('Error loading message details: ' + err.message);
    }
  };

  // Delete message
  const deleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      try {
        const token = getToken();
        if (!token) {
          alert('Authentication required');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/contact/messages/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMessages(messages.filter(msg => msg._id !== id));
            alert('Message deleted successfully!');
            fetchStats();
            
            if (showViewModal && selectedMessage?._id === id) {
              setShowViewModal(false);
              setSelectedMessage(null);
            }
          } else {
            alert(data.message || 'Failed to delete message');
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(errorData.message || 'Failed to delete message');
        }
      } catch (err) {
        console.error('Error deleting message:', err);
        alert('Error deleting message. Please try again.');
      }
    }
  };

  // Mark message as read/unread
  const toggleMessageStatus = async (id, currentStatus) => {
    try {
      const token = getToken();
      if (!token) {
        alert('Authentication required');
        return;
      }

      const newStatus = currentStatus === 'read' ? 'unread' : 'read';
      const response = await fetch(`http://localhost:5000/api/contact/messages/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(messages.map(msg => 
            msg._id === id ? { ...msg, status: newStatus } : msg
          ));
          
          if (selectedMessage?._id === id) {
            setSelectedMessage({...selectedMessage, status: newStatus});
          }
          
          fetchStats();
        }
      }
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };

  // Handle reply to message
  const handleReply = (message) => {
    setSelectedMessage(message);
    setReplyData({
      subject: `Re: ${message.subject || 'Your message'}`,
      message: ''
    });
    setShowReplyModal(true);
  };

  // Send reply
  const sendReply = async () => {
    if (!replyData.message.trim()) {
      alert('Please enter a reply message');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      if (!token) {
        alert('Authentication required');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/contact/messages/${selectedMessage._id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'replied' })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(messages.map(msg => 
            msg._id === selectedMessage._id ? { ...msg, status: 'replied' } : msg
          ));
          
          setShowReplyModal(false);
          setSelectedMessage(null);
          setReplyData({ subject: '', message: '' });
          
          alert('Reply sent successfully! (Note: Email functionality would be implemented here)');
          fetchStats();
        } else {
          alert(data.message || 'Failed to mark as replied');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to mark as replied');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Error sending reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and search messages
  const filteredMessages = messages.filter(message => {
    if (!message) return false;
    
    if (filter === 'read' && message.status !== 'read') return false;
    if (filter === 'unread' && message.status !== 'unread') return false;
    if (filter === 'replied' && message.status !== 'replied') return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const name = message.name || '';
      const email = message.email || '';
      const subject = message.subject || '';
      const messageText = message.message_preview || message.message || '';
      
      return (
        name.toLowerCase().includes(searchLower) ||
        email.toLowerCase().includes(searchLower) ||
        subject.toLowerCase().includes(searchLower) ||
        messageText.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Handle MySQL datetime format: "2026-01-18 23:56:34"
      const mysqlMatch = dateString.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
      if (mysqlMatch) {
        const [, year, month, day, hour, minute, second] = mysqlMatch;
        const date = new Date(year, month - 1, day, hour, minute, second);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString || 'N/A';
    }
  };

  // Get status badge class
  const getStatusClass = (status) => {
    if (!status) return 'status-unread';
    switch (status.toLowerCase()) {
      case 'read': return 'status-read';
      case 'unread': return 'status-unread';
      case 'replied': return 'status-replied';
      default: return 'status-unread';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    if (!status) return 'Unread';
    switch (status.toLowerCase()) {
      case 'read': return 'Read';
      case 'unread': return 'Unread';
      case 'replied': return 'Replied';
      default: return 'Unread';
    }
  };

  if (loading) {
    return (
      <div className="manage-contact">
        <div className="page-header">
          <h1>Contact Messages</h1>
          <button className="refresh-btn" disabled>
            <FaSpinner className="spinner" /> Loading...
          </button>
        </div>
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-contact">
        <div className="page-header">
          <h1>Contact Messages</h1>
          <button className="refresh-btn" onClick={fetchMessages}>
            <FaRedo /> Retry
          </button>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchMessages} className="retry-btn">
            <FaRedo /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-contact">
      <div className="page-header">
        <h1>Contact Messages</h1>
        <button 
          className="refresh-btn" 
          onClick={() => {
            fetchMessages();
            fetchStats();
          }}
        >
          <FaRedo /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaEnvelope />
          </div>
          <div className="stat-content">
            <h3>{stats.total || 0}</h3>
            <p>Total Messages</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon unread">
            <FaCommentDots />
          </div>
          <div className="stat-content">
            <h3>{stats.unread || 0}</h3>
            <p>Unread Messages</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon read">
            <FaCheck />
          </div>
          <div className="stat-content">
            <h3>{stats.read || 0}</h3>
            <p>Read Messages</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon replied">
            <FaReply />
          </div>
          <div className="stat-content">
            <h3>{stats.replied || 0}</h3>
            <p>Replied Messages</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-container">
        <div className="filter-group">
          <label><FaFilter /> Filter by Status:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
            <option value="replied">Replied Only</option>
          </select>
        </div>
        
        <div className="search-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Messages Table */}
      <div className="messages-table">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>From</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  <p>No messages found</p>
                </td>
              </tr>
            ) : (
              filteredMessages.map(message => (
                <tr key={message._id} className={message.status === 'unread' ? 'unread-row' : ''}>
                  <td>
                    <span className={`status-badge ${getStatusClass(message.status)}`}>
                      {getStatusText(message.status)}
                    </span>
                  </td>
                  
                  <td>
                    <div className="sender-info">
                      <strong>{message.name || 'Unknown'}</strong>
                      <small>{message.email || 'No email'}</small>
                      {message.phone && (
                        <small className="phone">
                          <FaPhone /> {message.phone}
                        </small>
                      )}
                    </div>
                  </td>
                  
                  <td className="subject-cell">
                    <strong>{message.subject || 'No subject'}</strong>
                  </td>
                  
                  <td className="message-preview">
                    <span title={message.message || message.message_preview || 'No message'}>
                      {/* Show message_preview from list API, or full message if loaded */}
                      {message.message || message.message_preview || 'Loading...'}
                    </span>
                  </td>
                  
                  <td>
                    <div className="date-info">
                      <FaCalendar />
                      <span>{formatDate(message.created_at)}</span>
                    </div>
                  </td>
                  
                  <td className="actions">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => viewMessage(message._id)}
                    >
                      <FaEye /> View
                    </button>
                    
                    <button 
                      className="action-btn reply-btn"
                      onClick={() => handleReply(message)}
                      disabled={message.status === 'replied'}
                    >
                      <FaReply /> Reply
                    </button>
                    
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => deleteMessage(message._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                    
                    <button 
                      className="action-btn status-btn"
                      onClick={() => toggleMessageStatus(message._id, message.status)}
                      title={message.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {message.status === 'read' ? <FaTimes /> : <FaCheck />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Message Modal */}
      {showViewModal && selectedMessage && (
        <div className="modal-overlay">
          <div className="modal view-modal">
            <div className="modal-header">
              <h3>
                <FaEnvelope /> Message Details
                <span className={`message-status ${getStatusClass(selectedMessage.status)}`}>
                  {getStatusText(selectedMessage.status)}
                </span>
              </h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedMessage(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="message-header">
                <div className="sender-details">
                  <div className="sender-avatar">
                    <FaUser />
                  </div>
                  <div className="sender-info">
                    <h4>{selectedMessage.name || 'Unknown'}</h4>
                    <p className="sender-email">{selectedMessage.email || 'No email'}</p>
                    {selectedMessage.phone && (
                      <p className="sender-phone">
                        <FaPhone /> {selectedMessage.phone}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="message-meta">
                  <p className="message-date">
                    <FaCalendar /> Received: {formatDate(selectedMessage.created_at)}
                  </p>
                  {selectedMessage.read_at && (
                    <p className="read-date">
                      Read: {formatDate(selectedMessage.read_at)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="message-subject">
                <h4>Subject: {selectedMessage.subject || 'No subject'}</h4>
              </div>
              
              <div className="message-content">
                <div className="content-box">
                  <p>{selectedMessage.message || selectedMessage.message_preview || 'No message content'}</p>
                </div>
              </div>
              
              <div className="message-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowViewModal(false);
                    handleReply(selectedMessage);
                  }}
                  disabled={selectedMessage.status === 'replied'}
                >
                  <FaReply /> Reply to Message
                </button>
                
                <button 
                  className="btn-danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this message?')) {
                      deleteMessage(selectedMessage._id);
                    }
                  }}
                >
                  <FaTrash /> Delete Message
                </button>
                
                <button 
                  className="btn-status"
                  onClick={() => toggleMessageStatus(selectedMessage._id, selectedMessage.status)}
                >
                  {selectedMessage.status === 'read' ? <FaTimes /> : <FaCheck />}
                  {selectedMessage.status === 'read' ? ' Mark as Unread' : ' Mark as Read'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="modal-overlay">
          <div className="modal reply-modal">
            <div className="modal-header">
              <h3><FaReply /> Reply to Message</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedMessage(null);
                  setReplyData({ subject: '', message: '' });
                }}
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="original-message">
                <h4>Original Message:</h4>
                <p><strong>From:</strong> {selectedMessage.name || 'Unknown'} ({selectedMessage.email || 'No email'})</p>
                <p><strong>Subject:</strong> {selectedMessage.subject || 'No subject'}</p>
                <p><strong>Message:</strong> {selectedMessage.message || selectedMessage.message_preview || 'No message content'}</p>
              </div>
              
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  value={replyData.subject}
                  onChange={(e) => setReplyData({...replyData, subject: e.target.value})}
                  placeholder="Reply subject"
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Your Reply *</label>
                <textarea
                  value={replyData.message}
                  onChange={(e) => setReplyData({...replyData, message: e.target.value})}
                  placeholder="Type your reply here..."
                  rows="6"
                  disabled={isSubmitting}
                  required
                />
                <small className="help-text">
                  Note: This is a demo. In a real application, this would send an email to {selectedMessage.email || 'the user'}
                </small>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedMessage(null);
                  setReplyData({ subject: '', message: '' });
                }}
                disabled={isSubmitting}
              >
                <FaTimes /> Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={sendReply}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner" /> Sending...
                  </>
                ) : (
                  <>
                    <FaReply /> Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageContact;