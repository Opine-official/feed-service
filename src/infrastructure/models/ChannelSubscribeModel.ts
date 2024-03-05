import mongoose, { Schema, InferSchemaType } from 'mongoose';

const ChannelSubscribeSchema = new Schema({
  channelSubscribeId: { type: String, required: true, unique: true },
  channelId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  channelName: { type: String, required: true, unique: true },
});

type ChannelSubscribeModel = InferSchemaType<typeof ChannelSubscribeSchema>;

const ChannelSubscribeModel = mongoose.model(
  'ChannelSubscribe',
  ChannelSubscribeSchema,
);

export default ChannelSubscribeModel;
