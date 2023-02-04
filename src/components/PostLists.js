import { useEffect, useState } from "react";
import "@aws-amplify/ui-react/styles.css";

import { PostContainer } from "./PostContainer";
import {
  TextInput,
  Button,
  Group,
  Container,
  Text,
  Textarea,
  Modal,
  Skeleton,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { API, graphqlOperation } from "aws-amplify";

import { listPosts } from "../graphql/queries";
import { createPost, deletePost } from "../graphql/mutations";
import { onDeletePost, onCreatePost } from "../graphql/subscriptions";
function PostLists() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      title: "",
      body: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      title: (value) =>
        value.length < 2 ? "Title must have at least 2 letters" : null,
      body: (value) =>
        value.length < 3 ? "Body must have at least 2 letters" : null,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const postsData = await API.graphql({
        query: listPosts,
        authMode: "API_KEY",
      });

      console.log(postsData, "postsData");
      setPosts(postsData.data.listPosts.items);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    const { name, title, body } = values;
    try {
      const { data } = await API.graphql({
        query: createPost,
        variables: {
          input: {
            name,
            title,
            body,
          },
        },
        authMode: "API_KEY",
      });
      const res = data.createPost;
      setPosts((post) => [res, ...post]);
      setOpened(false);
      form.reset();
    } catch (error) {}
  };

  const handleDeletePost = async (id) => {
    const { data } = await API.graphql({
      query: deletePost,
      variables: {
        input: {
          id,
        },
      },
      authMode: "API_KEY",
    });
    const res = data.deletePost;
    setPosts((posts) => {
      const toDeleteIndex = posts.findIndex((item) => item.id === res.id);
      return [
        ...posts.slice(0, toDeleteIndex),
        ...posts.slice(toDeleteIndex + 1),
      ];
    });
  };

  return (
    <Container>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create Post"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="Title"
            {...form.getInputProps("title")}
          />
          <Textarea withAsterisk label="Body" {...form.getInputProps("body")} />
          <TextInput
            withAsterisk
            label="Name"
            {...form.getInputProps("name")}
          />

          <Group position="right">
            <Button
              type="submit"
              variant="light"
              color="blue"
              fullWidth
              my="md"
              radius="md"
              loading={loading}
            >
              Add
            </Button>
          </Group>
        </form>
      </Modal>
      <Group position="center" my="sm">
        <Button onClick={() => setOpened(true)}>Create Post</Button>
      </Group>
      {loading && (
        <>
          {Array.from(Array(3).keys()).map((item, i) => (
            <Skeleton my={"sm"} visible={true} height={150} key={i}></Skeleton>
          ))}
        </>
      )}
      {posts.map((post, i) => (
        <PostContainer
          key={i}
          post={post}
          handleDeletePost={handleDeletePost}
        />
      ))}
    </Container>
  );
}

export default PostLists;
