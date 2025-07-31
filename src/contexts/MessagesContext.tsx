import { createContext, useContext, useState, ReactNode } from "react";

export interface Comment {
  id: string;
  author: string;
  role: 'Owner' | 'Manager' | 'External';
  content: string;
  timestamp: Date;
  avatar?: string;
  propertyId?: string;
  bidId?: string;
  type: 'property' | 'bid';
}

export interface PropertyChat {
  propertyId: string;
  propertyName: string;
  lastMessage?: Comment;
  unreadCount: number;
}

export interface BidChat {
  bidId: string;
  bidName: string;
  lastMessage?: Comment;
  unreadCount: number;
}

interface MessagesContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (propertyId: string | null) => void;
  selectedBidId: string | null;
  setSelectedBidId: (bidId: string | null) => void;
  viewMode: 'list' | 'property' | 'bid';
  setViewMode: (mode: 'list' | 'property' | 'bid') => void;
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  getCommentsForProperty: (propertyId: string) => Comment[];
  getCommentsForBid: (bidId: string) => Comment[];
  getPropertyChats: () => PropertyChat[];
  getBidChats: () => BidChat[];
  markAsRead: (id: string, type: 'property' | 'bid') => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};

interface MessagesProviderProps {
  children: ReactNode;
}

export const MessagesProvider = ({ children }: MessagesProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'property' | 'bid'>('list');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      role: "Owner",
      content: "Hi team, I wanted to check on the progress of the exterior renovations. The deadline is approaching and I need an update on the current status.",
      timestamp: new Date(2024, 10, 15, 14, 30),
      propertyId: "sunset-commons",
      type: "property"
    },
    {
      id: "2", 
      author: "Mike Rodriguez",
      role: "Manager",
      content: "Hi Sarah, the exterior work is 75% complete. We had some weather delays last week but the contractor assures me we'll be back on track. I'll have a detailed report ready by Friday.",
      timestamp: new Date(2024, 10, 15, 16, 45),
      propertyId: "sunset-commons",
      type: "property"
    },
    {
      id: "3",
      author: "David Chen",
      role: "External",
      content: "This is David from ABC Construction. We've completed the east and south facades. The west side should be finished by Wednesday, weather permitting.",
      timestamp: new Date(2024, 10, 16, 9, 15),
      propertyId: "sunset-commons",
      type: "property"
    },
    {
      id: "4",
      author: "Maria Garcia",
      role: "Manager",
      content: "Just wanted to update everyone on the Oak Street property. The plumbing work has started and should be completed by next week.",
      timestamp: new Date(2024, 10, 17, 10, 0),
      propertyId: "oak-street-complex",
      type: "property"
    },
    {
      id: "5",
      author: "Premier Construction LLC",
      role: "External",
      content: "We're starting the kitchen renovation in unit 101 tomorrow. All materials have been delivered and the crew will begin at 8 AM.",
      timestamp: new Date(2024, 10, 18, 9, 0),
      bidId: "BID-001",
      type: "bid"
    },
    {
      id: "6",
      author: "John Smith",
      role: "Manager",
      content: "Great! Please make sure to follow the noise guidelines and notify residents 24 hours in advance.",
      timestamp: new Date(2024, 10, 18, 10, 15),
      bidId: "BID-001",
      type: "bid"
    }
  ]);
  
  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});

  const addComment = (comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setComments(prev => [...prev, newComment]);
  };

  const getCommentsForProperty = (propertyId: string) => {
    return comments.filter(comment => comment.type === 'property' && comment.propertyId === propertyId);
  };

  const getCommentsForBid = (bidId: string) => {
    return comments.filter(comment => comment.type === 'bid' && comment.bidId === bidId);
  };

  const getPropertyChats = (): PropertyChat[] => {
    const propertyMap = new Map<string, PropertyChat>();
    
    comments.filter(comment => comment.type === 'property').forEach(comment => {
      if (!propertyMap.has(comment.propertyId!)) {
        propertyMap.set(comment.propertyId!, {
          propertyId: comment.propertyId!,
          propertyName: comment.propertyId === 'sunset-commons' 
            ? 'Sunset Commons Apartments' 
            : 'Oak Street Complex',
          lastMessage: comment,
          unreadCount: 0
        });
      } else {
        const existing = propertyMap.get(comment.propertyId!)!;
        if (comment.timestamp > existing.lastMessage!.timestamp) {
          existing.lastMessage = comment;
        }
      }
    });

    // Calculate unread counts
    propertyMap.forEach((chat, propertyId) => {
      const propertyComments = getCommentsForProperty(propertyId);
      chat.unreadCount = readStatus[`property-${propertyId}`] ? 0 : propertyComments.length;
    });

    return Array.from(propertyMap.values()).sort((a, b) => 
      (b.lastMessage?.timestamp.getTime() || 0) - (a.lastMessage?.timestamp.getTime() || 0)
    );
  };

  const getBidChats = (): BidChat[] => {
    const bidMap = new Map<string, BidChat>();
    
    comments.filter(comment => comment.type === 'bid').forEach(comment => {
      if (!bidMap.has(comment.bidId!)) {
        bidMap.set(comment.bidId!, {
          bidId: comment.bidId!,
          bidName: comment.bidId === 'BID-001' 
            ? 'Premier Construction - Kitchen Renovation' 
            : comment.bidId === 'BID-002'
            ? 'Elite Renovations - HVAC Systems'
            : `Bid ${comment.bidId}`,
          lastMessage: comment,
          unreadCount: 0
        });
      } else {
        const existing = bidMap.get(comment.bidId!)!;
        if (comment.timestamp > existing.lastMessage!.timestamp) {
          existing.lastMessage = comment;
        }
      }
    });

    // Calculate unread counts
    bidMap.forEach((chat, bidId) => {
      const bidComments = getCommentsForBid(bidId);
      chat.unreadCount = readStatus[`bid-${bidId}`] ? 0 : bidComments.length;
    });

    return Array.from(bidMap.values()).sort((a, b) => 
      (b.lastMessage?.timestamp.getTime() || 0) - (a.lastMessage?.timestamp.getTime() || 0)
    );
  };

  const markAsRead = (id: string, type: 'property' | 'bid') => {
    setReadStatus(prev => ({ ...prev, [`${type}-${id}`]: true }));
  };

  return (
    <MessagesContext.Provider value={{
      isOpen,
      setIsOpen,
      selectedPropertyId,
      setSelectedPropertyId,
      selectedBidId,
      setSelectedBidId,
      viewMode,
      setViewMode,
      comments,
      addComment,
      getCommentsForProperty,
      getCommentsForBid,
      getPropertyChats,
      getBidChats,
      markAsRead
    }}>
      {children}
    </MessagesContext.Provider>
  );
};