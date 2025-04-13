import mongoose, { Schema, Document, Model } from "mongoose";

// Clear the existing model if it exists
if (mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

// Define notification types enum
export enum NotificationTypes {
  LIKE = "like",
  COMMENT = "comment",
  FOLLOW = "follow",
  MENTION = "mention",
  SHARE = "share",
  ADMIN = "admin"
}

// Notification Interface
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationTypes;
  actorId: mongoose.Types.ObjectId;
  postId?: mongoose.Types.ObjectId;
  commentId?: mongoose.Types.ObjectId;
  message?: string;
  read: boolean;
  createdAt: Date;
}

// Notification Schema
const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(NotificationTypes),
      validate: {
        validator: function(v: string) {
          return Object.values(NotificationTypes).includes(v as NotificationTypes);
        },
        message: props => `${props.value} is not a valid notification type`
      }
    },
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    message: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create and export the model
const Notification = mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
