import { Card, Text, Button, Group, Badge } from "@mantine/core";

export function CardContainer({ pet, handleDeletePet }) {
  const { name, description, owner, petType, id } = pet;
  return (
    <Card shadow="sm" p="lg" radius="md" mt={"sm"} withBorder>
      <Group position="apart" mt="md" mb="xs">
        <Text>
          <Badge>Pet name:</Badge> <span>{name}</span>
        </Text>
        <Text>
          <Badge>Pet type:</Badge> <span>{petType}</span>
        </Text>
        <Text>
          <Badge>Description:</Badge> <span>{description}</span>
        </Text>

        <Button
          onClick={() => {
            handleDeletePet(id);
          }}
          color="pink"
          variant="light"
        >
          Delete
        </Button>
      </Group>
    </Card>
  );
}
