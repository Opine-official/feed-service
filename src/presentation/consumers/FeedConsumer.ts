import { DeletePost } from '../../application/use-cases/DeletePost';
import { SaveChannelSubscribe } from '../../application/use-cases/SaveChannelSubscribe';
import { SavePost } from '../../application/use-cases/SavePost';
import SaveUser from '../../application/use-cases/SaveUser';
import { UpdateUser } from '../../application/use-cases/UpdateUser';
import kafka from '../../infrastructure/brokers/kafka/config';
import { ChannelSubscribeRepository } from '../../infrastructure/repositories/ChannelSubscribeRepository';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

const consumer = kafka.consumer({ groupId: 'feed-consumer-group' });
const producer = kafka.producer();

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-register-topic' });
  await consumer.subscribe({ topic: 'post-create-topic' });
  await consumer.subscribe({ topic: 'post-delete-topic' });
  await consumer.subscribe({ topic: 'channel-subscribe-topic' });
  await consumer.subscribe({ topic: 'channel-subscribe-delete-topic' });
  await producer.connect();
  const userRepository = new UserRepository();
  const postRepository = new PostRepository();
  const channelSubscribeRepository = new ChannelSubscribeRepository();

  const saveUser = new SaveUser(userRepository);
  const updateUser = new UpdateUser(userRepository);
  const savePost = new SavePost(postRepository, userRepository);
  const deletePost = new DeletePost(postRepository);
  const saveChannelSubscribe = new SaveChannelSubscribe(
    channelSubscribeRepository,
  );

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        'reached here': true,
        topic,
        partition,
        value: message?.value?.toString(),
      });

      if (!message?.value?.toString()) {
        return;
      }

      if (topic === 'user-register-topic') {
        const userData = JSON.parse(message?.value?.toString());

        const saveUserResult = await saveUser.execute(userData);

        if (saveUserResult instanceof Error) {
          console.error(saveUserResult);
          return;
        }
      } else if (topic === 'post-create-topic') {
        const postData = JSON.parse(message?.value?.toString());

        const savePostResult = await savePost.execute(postData);

        if (savePostResult instanceof Error) {
          console.error(savePostResult);
          return;
        }
      } else if (topic === 'post-delete-topic') {
        const slug = JSON.parse(message?.value?.toString());

        const deletePostResult = await deletePost.execute({ slug: slug });

        if (deletePostResult instanceof Error) {
          console.error(deletePostResult);
          try {
            const sendResult = await producer.send({
              topic: 'post-delete-response-topic',
              messages: [
                {
                  key: 'post-delete-response-key',
                  value: JSON.stringify({
                    success: false,
                    message: 'post not deleted',
                  }),
                },
              ],
            });
            console.log('Message sent, error:', sendResult);
          } catch (error) {
            console.error('Error sending message:', error);
          }
          return;
        }

        try {
          const sendResult = await producer.send({
            topic: 'post-delete-response-topic',
            messages: [
              {
                key: 'post-delete-response-key',
                value: JSON.stringify({
                  success: true,
                  message: 'post deleted',
                }),
              },
            ],
          });
          console.log('Message sent, success:', sendResult);
        } catch (error) {
          console.error('Error sending message:', error);
        }

        console.log('send acknowledgement');
      } else if (topic === 'channel-subscribe-topic') {
        const channelData = JSON.parse(message?.value?.toString());

        const saveChannelResult =
          await saveChannelSubscribe.execute(channelData);

        if (saveChannelResult instanceof Error) {
          console.error(saveChannelResult);
          return;
        }
      } else if (topic === 'channel-subscribe-delete-topic') {
        const channelSubscribeId = JSON.parse(message?.value?.toString());

        const deleteChannelSubscribeResult =
          await channelSubscribeRepository.delete(channelSubscribeId);

        if (deleteChannelSubscribeResult instanceof Error) {
          console.error(deleteChannelSubscribeResult);
          return;
        }
      } else if (topic === 'user-update-topic') {
        const userData = JSON.parse(message?.value?.toString());

        const updateUserResult = await updateUser.execute(userData);

        if (updateUserResult instanceof Error) {
          console.error(updateUserResult);
          return;
        }
      }

      console.log('consumer end');
    },
  });
};

run().catch(console.error);

export default run;
