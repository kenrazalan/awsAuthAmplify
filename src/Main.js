import { useEffect, useState } from "react";
import "@aws-amplify/ui-react/styles.css";

import { HeaderSimple } from "./components/Header";
import { CardContainer } from "./components/CardContainer";
import { TextInput, Button, Group, Container, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createPet, deletePet } from "./graphql/mutations";
import { onCreatePet, onDeletePet } from "./graphql/subscriptions";
import { API, graphqlOperation } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { listPets } from "./graphql/queries";

function Main() {
  const [pets, setpets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const links = [
    {
      link: "/",
      label: "Log out",
    },
  ];
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      petType: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      petType: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      description: (value) =>
        value.length < 3 ? "Description must have at least 2 letters" : null,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const petsData = await API.graphql(graphqlOperation(listPets));

      setpets(petsData.data.listPets.items);
    };

    const createSub = API.graphql(graphqlOperation(onCreatePet)).subscribe({
      next: ({ value }) => {
        setLoading(false);
        setpets((pets) => [value.data.onCreatePet, ...pets]);
        form.reset();
      },
      error: () => {
        setLoading(false);
      },
    });

    const deleteSub = API.graphql(graphqlOperation(onDeletePet)).subscribe({
      next: ({ value }) => {
        setpets((pets) => {
          const toDeleteIndex = pets.findIndex(
            (item) => item.id === value.data.onDeletePet.id
          );
          return [
            ...pets.slice(0, toDeleteIndex),
            ...pets.slice(toDeleteIndex + 1),
          ];
        });
      },
    });
    fetchData();
    return () => {
      createSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, []);

  const handleSubmit = async (values) => {
    const { name, description, petType } = values;
    setLoading(true);
    await API.graphql({
      query: createPet,
      variables: {
        input: {
          name,
          description,
          petType,
        },
      },
    });
  };
  const handleDeletePet = async (id) => {
    await API.graphql({
      query: deletePet,
      variables: {
        input: {
          id,
        },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      },
    });
  };
  return (
    <Container>
      <HeaderSimple links={links} signOut={signOut} user={user} />
      <Text weight={"bold"} align="center">
        Create Pet
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput withAsterisk label="Name" {...form.getInputProps("name")} />
        <TextInput
          withAsterisk
          label="Pet Type"
          {...form.getInputProps("petType")}
        />
        <TextInput
          withAsterisk
          label="Description"
          {...form.getInputProps("description")}
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

      {pets.sort().map((pet, i) => (
        <CardContainer key={i} pet={pet} handleDeletePet={handleDeletePet} />
      ))}
    </Container>
  );
}

export default Main;
