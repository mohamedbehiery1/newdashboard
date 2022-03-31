import { Helmet } from "react-helmet";
import { Box, Container, Grid, Card, CardHeader, Divider, CardContent, CircularProgress } from "@material-ui/core";
import { $APP_NAME } from "src/constants";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { map, filter } from "lodash";
import WhatsappMessagesService from "src/__services__/WhatsappMessagesService";
import AuthService from "src/__services__/AuthService";
import { WhatsappMessage } from "./components";

const WhatsappMessagesSettings = () => {
  const { t } = useTranslation();
  const { role } = AuthService.getCurrentUser();

  const [messages, setMessages] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(_ => {
    loadMessages();
  }, []);

  const loadMessages = async _ => {
    try {
      const { data } = await WhatsappMessagesService.getMessages(role);
      setMessages(data.body);
    } catch (e) {
      console.log(e)
    } finally {
      setTimeout(_ => setLoading(false), 500);
    }
  }

  const handleMessageAdded = message => {
    setMessages([...messages, message])
  }

  const handleMessageDeleted = id => {
    const msgs = filter(messages, message => message.id !== id)
    setMessages(msgs)
  }

  return (
    <>
      <Helmet>
        <title>Whatsapp Messages Settings | {$APP_NAME}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title={t("Whatsapp Messages")} />
                <Divider />
                {
                  loading
                    ?
                    <Box sx={{ width: "100%", height: '100px', display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CircularProgress color="main" />
                    </Box>
                    :
                    map(
                      messages,
                      msg => (
                        <>
                          <CardContent>
                            <WhatsappMessage
                              message={msg}
                              onMessageDeleted={handleMessageDeleted}
                            />
                          </CardContent>
                          <Divider />
                        </>
                      )
                    )
                }
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title={t("Add Message")} />
                <Divider />
                <CardContent>
                  <WhatsappMessage
                    onMessageAdded={handleMessageAdded}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
};

export default WhatsappMessagesSettings;
