import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  UserPlus, 
  Mail,
  Building2,
  User,
  Clock,
  ArrowLeft,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMessages } from "@/contexts/MessagesContext";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string, role: string) => void;
}

const InviteModal = ({ open, onOpenChange, onInvite }: InviteModalProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("External");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onInvite(email, role);
      setEmail("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite to Comments</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="contractor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="External">External Contractor</option>
              <option value="Manager">Property Manager</option>
              <option value="Owner">Property Owner</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Mail className="w-4 h-4 mr-2" />
              Send Invite
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const MessagesSidebar = () => {
  const location = useLocation();
  const { toast } = useToast();
  const {
    isOpen,
    setIsOpen,
    selectedPropertyId,
    setSelectedPropertyId,
    addComment,
    getCommentsForProperty,
    getPropertyChats,
    markAsRead
  } = useMessages();

  const [newComment, setNewComment] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Определяем, находимся ли мы на странице конкретной property
  const isOnPropertyPage = location.pathname === '/property';
  const currentPropertyId = isOnPropertyPage ? 'sunset-commons' : null;

  // Если мы на странице property и sidebar открыт впервые, сразу показываем чат этой property
  const shouldShowPropertyChat = isOnPropertyPage && currentPropertyId && !selectedPropertyId;
  const activePropertyId = shouldShowPropertyChat ? currentPropertyId : selectedPropertyId;
  
  // На странице property всегда показываем кнопку назад (даже когда показываем чат этой property)
  const showBackButton = isOnPropertyPage || selectedPropertyId;

  const propertyChats = getPropertyChats();
  const activeComments = activePropertyId ? getCommentsForProperty(activePropertyId) : [];

  const handleAddComment = () => {
    if (newComment.trim() && activePropertyId) {
      addComment({
        author: "Current User",
        role: "Manager",
        content: newComment.trim(),
        propertyId: activePropertyId
      });
      
      setNewComment("");
      
      toast({
        title: "Comment Posted",
        description: "Your message has been added to the thread."
      });
    }
  };

  const handleInvite = (email: string, role: string) => {
    toast({
      title: "Invitation Sent",
      description: `Invited ${email} as ${role} to join the conversation.`
    });
  };

  const handleSelectProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    markAsRead(propertyId);
  };

  const handleBackToList = () => {
    setSelectedPropertyId(null);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'bg-blue-100 text-blue-800';
      case 'Manager':
        return 'bg-green-100 text-green-800';
      case 'External':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Owner':
        return Building2;
      case 'Manager':
        return User;
      case 'External':
        return UserPlus;
      default:
        return User;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-xl border-l">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="mr-2 p-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              {activePropertyId ? "Messages" : "Property Chats"}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {!activePropertyId ? (
            /* Property Chats List */
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {propertyChats.map((chat) => (
                  <div
                    key={chat.propertyId}
                    onClick={() => handleSelectProperty(chat.propertyId)}
                    className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {chat.propertyName}
                      </h3>
                      {chat.unreadCount > 0 && (
                        <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <div className="text-xs text-gray-600">
                        <p className="truncate mb-1">
                          <span className="font-medium">{chat.lastMessage.author}:</span> {chat.lastMessage.content}
                        </p>
                        <p className="text-gray-400">
                          {chat.lastMessage.timestamp.toLocaleDateString()} at {chat.lastMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            /* Property Chat */
            <>
              {/* Property Info */}
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-medium text-gray-900">
                  {activePropertyId === 'sunset-commons' ? 'Sunset Commons Apartments' : 'Oak Street Complex'}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-600">
                    {activeComments.length} message{activeComments.length !== 1 ? 's' : ''}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowInviteModal(true)}
                  >
                    <UserPlus className="w-3 h-3 mr-1" />
                    Invite
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeComments.map((comment) => {
                    const RoleIcon = getRoleIcon(comment.role);
                    return (
                      <div key={comment.id} className="border-l-4 border-blue-200 pl-3 py-2">
                        <div className="flex items-start space-x-2">
                          <Avatar className="w-6 h-6">
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                              {comment.author.charAt(0)}
                            </div>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-gray-900">
                                {comment.author}
                              </span>
                              <Badge variant="secondary" className={`text-xs ${getRoleColor(comment.role)}`}>
                                <RoleIcon className="w-2 h-2 mr-1" />
                                {comment.role}
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-gray-700 whitespace-pre-wrap mb-1">
                              {comment.content}
                            </p>
                            
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-2 h-2 mr-1" />
                              {comment.timestamp.toLocaleDateString()} at {comment.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Add Comment */}
              <div className="border-t p-4">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Type your message here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px] resize-none text-sm"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      size="sm"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <InviteModal
          open={showInviteModal}
          onOpenChange={setShowInviteModal}
          onInvite={handleInvite}
        />
      </div>
    </div>
  );
};