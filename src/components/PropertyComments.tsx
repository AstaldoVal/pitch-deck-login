import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  Send, 
  UserPlus, 
  Mail,
  Building2,
  User,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author: string;
  role: 'Owner' | 'Manager' | 'External';
  content: string;
  timestamp: Date;
  avatar?: string;
}

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

export const PropertyComments = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      role: "Owner",
      content: "Hi team, I wanted to check on the progress of the exterior renovations. The deadline is approaching and I need an update on the current status.",
      timestamp: new Date(2024, 10, 15, 14, 30)
    },
    {
      id: "2", 
      author: "Mike Rodriguez",
      role: "Manager",
      content: "Hi Sarah, the exterior work is 75% complete. We had some weather delays last week but the contractor assures me we'll be back on track. I'll have a detailed report ready by Friday.",
      timestamp: new Date(2024, 10, 15, 16, 45)
    },
    {
      id: "3",
      author: "David Chen",
      role: "External",
      content: "This is David from ABC Construction. We've completed the east and south facades. The west side should be finished by Wednesday, weather permitting.",
      timestamp: new Date(2024, 10, 16, 9, 15)
    }
  ]);

  const [newComment, setNewComment] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { toast } = useToast();

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "Current User", // This would come from auth context
        role: "Manager", // This would come from user's role
        content: newComment.trim(),
        timestamp: new Date()
      };
      
      setComments([...comments, comment]);
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

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MessageSquare className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowInviteModal(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite
        </Button>
      </div>

      {/* Comments List */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {comments.map((comment) => {
          const RoleIcon = getRoleIcon(comment.role);
          return (
            <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-3">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                    {comment.author.charAt(0)}
                  </div>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.author}
                    </span>
                    <Badge variant="secondary" className={getRoleColor(comment.role)}>
                      <RoleIcon className="w-3 h-3 mr-1" />
                      {comment.role}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {comment.timestamp.toLocaleDateString()} at {comment.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Comment */}
      <div className="border-t pt-4">
        <div className="space-y-3">
          <Textarea
            placeholder="Type your message here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              size="sm"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>
      </div>

      <InviteModal
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
        onInvite={handleInvite}
      />
    </Card>
  );
};