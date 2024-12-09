import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Trash2, Plus, MessageSquare } from "lucide-react"
import { io } from "socket.io-client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage,
  searchUsers,
  markMessagesAsRead,
} from "../redux/actions/messageActions"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const MessagesPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const {
    conversations = [],
    currentConversation = [],
    users = [],
    loading = false,
  } = useSelector((state) => state.messages)

  const socketRef = useRef()
  const [isConnected, setIsConnected] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [messageText, setMessageText] = useState("")
  const [userFilter, setUserFilter] = useState("all")
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef()
  const messagesEndRef = useRef(null)

  // Socket connection
  useEffect(() => {
    socketRef.current = io("http://localhost:5001", { withCredentials: true })

    socketRef.current.on("connect", () => {
      setIsConnected(true)
      if (user?._id) {
        socketRef.current.emit("join", user._id)
      }
    })

    socketRef.current.on("receive-message", (message) => {
      if (message.sender._id !== user?._id) {
        dispatch({ type: "SEND_MESSAGE_SUCCESS", payload: message })
        // Only refresh conversations if not currently viewing this sender's messages
        if (selectedUser?._id !== message.sender._id) {
          dispatch(getConversations())
        } else {
          // If viewing the conversation, mark as read immediately
          dispatch(markMessagesAsRead(message.sender._id))
        }
      }
    })

    socketRef.current.on("messages-read", (data) => {
      // Refresh conversations to update read status
      dispatch(getConversations())
    })

    socketRef.current.on("user-typing", (senderId) => {
      if (senderId === selectedUser?._id) {
        setIsTyping(true)
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
      }
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [dispatch, user?._id, selectedUser])

  // Fetch initial conversations
  useEffect(() => {
    dispatch(getConversations())
  }, [dispatch])

  // Fetch messages when user selected
  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessages(selectedUser._id))
      // Add this line to mark messages as read
      dispatch(markMessagesAsRead(selectedUser._id))
    }
  }, [dispatch, selectedUser])

  // Search users when filter changes
  useEffect(() => {
    if (isNewMessageOpen) {
      dispatch(searchUsers(userFilter))
    }
  }, [userFilter, isNewMessageOpen, dispatch])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConversation])

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedUser?._id) {
      // Mark messages as read when conversation is selected
      dispatch(markMessagesAsRead(selectedUser._id))
    }
  }, [dispatch, selectedUser, currentConversation])

  const handleSendMessage = async () => {
    if (!messageText?.trim() || !selectedUser?._id) return

    const content = messageText.trim()
    setMessageText("") // Clear immediately

    const result = await dispatch(sendMessage(selectedUser._id, content))
    if (result?.success) {
      // Only emit to other user, don't dispatch again
      socketRef.current.emit("private-message", {
        message: result.data,
        receiverId: selectedUser._id,
      })
    }
  }

  const handleTyping = () => {
    if (socketRef.current && isConnected && selectedUser?._id) {
      socketRef.current.emit("typing", {
        receiverId: selectedUser._id,
        senderId: user?._id,
      })
    }
  }

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) return
    await dispatch(deleteMessage(messageId))
  }

  const handleStartConversation = async (user) => {
    if (!user?._id) return
    setSelectedUser(user)
    setIsNewMessageOpen(false)
    await dispatch(getMessages(user._id))

    // Mark messages as read and emit socket event
    if (socketRef.current && isConnected) {
      await dispatch(markMessagesAsRead(user._id))
      socketRef.current.emit("mark-read", {
        senderId: user._id,
        readBy: user?._id,
        conversationId: user._id,
      })
    }
  }
  const getInitials = (name) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const MessagesArea = ({
    currentConversation,
    user,
    getInitials,
    handleDeleteMessage,
  }) => {
    // Sort messages by date first
    const sortedMessages = [...currentConversation].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    )

    const messagesByDate = sortedMessages.reduce((acc, message) => {
      const date = new Date(message.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      acc[date] = acc[date] || []
      acc[date].push(message)
      return acc
    }, {})

    const formatTimestamp = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    }

    return (
      <div className='flex-1 overflow-y-auto p-4 space-y-6'>
        {Object.entries(messagesByDate).map(([date, messages]) => (
          <div key={date}>
            <div className='flex items-center justify-center text-sm text-gray-400 py-2'>
              <div className='flex-1 h-px bg-gray-200'></div>
              <span className='px-4'>{date}</span>
              <div className='flex-1 h-px bg-gray-200'></div>
            </div>
            <div className='space-y-4'>
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex gap-2 items-start ${
                    message.sender._id === user?._id
                      ? "flex-row-reverse mr-4"
                      : "flex-row ml-4"
                  }`}
                >
                  <Avatar className='h-8 w-8 flex-shrink-0'>
                    <AvatarFallback>
                      {getInitials(
                        message.sender._id === user?._id
                          ? user.name
                          : message.sender?.name
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col ${
                      message.sender._id === user?._id
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 max-w-md ${
                        message.sender._id === user?._id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      <p className='text-sm'>{message.content}</p>
                    </div>
                    <div
                      className={`flex items-center gap-2 mt-1 ${
                        message.sender._id === user?._id
                          ? "flex-row"
                          : "flex-row-reverse"
                      }`}
                    >
                      {message.sender._id === user?._id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-6 px-2 text-gray-500 hover:text-red-500'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Message
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this message?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMessage(message._id)}
                                className='bg-red-500 hover:bg-red-600'
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <span className='text-xs text-gray-500'>
                        {formatTimestamp(message.createdAt)}
                        {message.sender._id === user?._id && message.read && (
                          <span className='ml-1 text-blue-500'>✓</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isTyping && (
          <div className='text-sm text-gray-500 ml-4'>
            {selectedUser.name} is typing...
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='h-[calc(100vh-64px)] flex overflow-hidden bg-gray-50'>
      <div className='flex w-full'>
        {/* Sidebar */}
        <div className='w-80 bg-white shadow-md flex flex-col h-full'>
          <div className='p-4 flex-shrink-0'>
            <h2 className='text-lg font-semibold mb-4'>Messages</h2>
            <Sheet open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
              <SheetTrigger asChild>
                <Button className='w-full'>
                  <Plus className='h-4 w-4 mr-2' />
                  New Message
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-96'>
                <SheetHeader>
                  <SheetTitle>New Message</SheetTitle>
                </SheetHeader>
                <div className='mt-4 space-y-4'>
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder='Filter by role' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Users</SelectItem>
                      <SelectItem value='artist'>Artists</SelectItem>
                      <SelectItem value='requester'>Requesters</SelectItem>
                    </SelectContent>
                  </Select>

                  <ScrollArea className='h-[400px] border rounded-md'>
                    <div className='p-4 space-y-4'>
                      {loading ? (
                        <div className='flex justify-center p-4'>
                          <Loader2 className='h-6 w-6 animate-spin' />
                        </div>
                      ) : !users || users.length === 0 ? (
                        <div className='text-center text-gray-500 p-4'>
                          No users found
                        </div>
                      ) : (
                        users.map((user) => (
                          <div
                            key={user._id}
                            className='flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer'
                            onClick={() => handleStartConversation(user)}
                          >
                            <div className='flex items-center gap-3'>
                              <Avatar>
                                <AvatarFallback>
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className='font-medium'>{user.name}</p>
                                <p className='text-sm text-gray-500 capitalize'>
                                  {user.role}
                                </p>
                              </div>
                            </div>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStartConversation(user)
                              }}
                            >
                              <MessageSquare className='h-4 w-4' />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <ScrollArea className='flex-1 h-[calc(100vh-180px)]'>
            <div className='p-2'>
              {!conversations || conversations.length === 0 ? (
                <div className='text-center text-gray-500 p-4'>
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    onClick={async () => {
                      await handleStartConversation(conv.otherUser)
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
                        ${
                          selectedUser?._id === conv.otherUser._id
                            ? "bg-gray-100"
                            : "hover:bg-gray-50"
                        }`}
                  >
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(conv.otherUser?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium truncate'>
                        {conv.otherUser?.name}
                      </p>
                      <p className='text-sm text-gray-500 truncate'>
                        {conv.lastMessage?.content}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className='h-5 w-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs'>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className='flex-1 flex flex-col h-full'>
          {selectedUser ? (
            <>
              <div className='h-16 p-4 border-b bg-white flex-shrink-0'>
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(selectedUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className='font-medium'>{selectedUser.name}</h3>
                    <p className='text-sm text-gray-500'>{selectedUser.role}</p>
                  </div>
                </div>
              </div>

              <div className='flex-1 overflow-y-auto bg-white'>
                <MessagesArea
                  currentConversation={currentConversation}
                  user={user}
                  getInitials={getInitials}
                  handleDeleteMessage={handleDeleteMessage}
                />
              </div>

              <div className='h-16 p-4 border-t bg-white flex-shrink-0'>
                <div className='flex gap-2'>
                  <Input
                    placeholder='Type your message...'
                    className='flex-1'
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value)
                      handleTyping()
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className='h-4 w-4 mr-2' />
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className='flex-1 flex items-center justify-center bg-gray-50'>
              <div className='text-center'>
                <h3 className='text-lg font-medium text-gray-900'>
                  No conversation selected
                </h3>
                <p className='text-gray-500'>
                  Choose a conversation or start a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesPage
