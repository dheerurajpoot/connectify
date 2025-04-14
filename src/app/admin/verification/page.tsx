"use client";

import { getVerificationRequests, updateVerificationRequest } from "@/app/actions/admin-actions";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Calendar, ExternalLink, Globe, Info, Link2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VerificationRequest {
  _id: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
  };
  links: string[];
  about: string;
  category: string;
  governmentId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function AdminVerificationPage() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [status]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const result = await getVerificationRequests(status);
      if (result.success) {
        setRequests(result.requests || []);
      } else {
        toast.error(result.error || "Failed to load verification requests");
      }
    } catch (error) {
      toast.error("Failed to load verification requests");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const result = await updateVerificationRequest(requestId, newStatus);
      if (result.success) {
        toast.success(`Request ${newStatus} successfully`);
        loadRequests();
      } else {
        toast.error(result.error || "Failed to update request");
      }
    } catch (error) {
      toast.error("Failed to update request");
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Verification Requests</h1>
          <p className="text-gray-500 mt-1">Manage user verification requests</p>
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading requests...</div>
      ) : requests.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          No {status} verification requests found
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={request.userId.avatar} />
                    <AvatarFallback>{request.userId.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{request.userId.name}</h3>
                    <p className="text-gray-500">@{request.userId.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getStatusBadgeStyle(request.status)}>
                        {request.status}
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4" />
                    About
                  </h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{request.about}</p>
                </div>

                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4" />
                    Category
                  </h4>
                  <p className="text-gray-600">{request.category}</p>
                </div>

                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Link2 className="w-4 h-4" />
                    Verification Links
                  </h4>
                  <div className="grid gap-2">
                    {request.links.map((link: string, index: number) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 flex items-center gap-2 bg-blue-50 p-2 rounded-md"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {link}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <BadgeCheck className="w-4 h-4" />
                    Government ID
                  </h4>
                  <a
                    href={request.governmentId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Document
                  </a>
                </div>
              </div>

              {request.status === "pending" && (
                <div className="mt-6 flex gap-3 justify-end border-t pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleUpdateStatus(request._id, "rejected")}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject Request
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleUpdateStatus(request._id, "approved")}
                  >
                    <BadgeCheck className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
