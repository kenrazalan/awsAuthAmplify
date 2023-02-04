import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import Main from "./Main";
import { Header, Container, Button, Text } from "@mantine/core";
import { useStyles } from "./utils";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import PostLists from "./components/PostLists";

function App() {
  const { classes } = useStyles();
  return (
    <Router>
      <Header height={60} mb={120}>
        <Container className={classes.header}>
          <Link to={"/"}>
            <Text weight={"bold"}>Home</Text>
          </Link>
          <Link to="/posts">
            <Text weight={"bold"}>Posts (No Auth)</Text>
          </Link>
        </Container>
      </Header>

      <Routes>
        <Route
          exact
          path="/"
          element={
            <Authenticator>
              {({ signOut, user }) => <Main signOut={signOut} user={user} />}
            </Authenticator>
          }
        />

        <Route path="/posts" element={<PostLists />} />
      </Routes>
    </Router>
  );
}

export default App;
