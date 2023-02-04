import {
  Card,
  Image,
  Text,
  ActionIcon,
  Badge,
  Group,
  Center,
  Avatar,
  createStyles,
  Box,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons";
const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  rating: {
    position: "absolute",
    top: theme.spacing.xs,
    right: theme.spacing.xs + 2,
    pointerEvents: "none",
  },

  title: {
    display: "block",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs / 2,
  },

  action: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    }),
  },

  footer: {
    marginTop: theme.spacing.md,
  },
}));

export function PostContainer({ post, handleDeletePost }) {
  console.log(post, "posts");
  const { name, id, title, body } = post;
  const { classes, cx } = useStyles();

  return (
    <Card withBorder radius="md" className={cx(classes.card)} my="xs">
      <Text className={classes.title} weight={500} component="a">
        {title}
      </Text>

      <Text size="sm" color="dimmed" lineClamp={4}>
        {body}
      </Text>

      <Group position="apart" className={classes.footer}>
        <Center>
          <Avatar bg="blue" size={24} radius="xl" mr="xs" />
          <Text size="sm" inline>
            {name}
          </Text>
        </Center>
        <Group spacing={8} mr={0}>
          <Box
            onClick={() => {
              handleDeletePost(id);
            }}
            style={{ cursor: "pointer" }}
          >
            <Avatar
              src={require("../trash.png")}
              size={20}
              radius="xl"
              mr="xs"
            />
          </Box>
        </Group>
      </Group>
    </Card>
  );
}
