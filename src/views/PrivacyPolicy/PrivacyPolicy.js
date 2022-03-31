import React, { useEffect, useState } from "react";
import { Typography, Container } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { $APP_NAME } from "src/constants";
import HttpService from 'src/__services__/httpService';
import { pick } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Box } from "@material-ui/system";

import { $BASE_URL } from "src/constants";
const apiUrl = $BASE_URL + '/api';

const privacy = {
  title: "Mapit Driver App License Agreement",
  intro: `
    This License Agreement (“Agreement”) is between you and Mapit and governs use of this app made available through the Apple App Store and Google Play Store. By installing the
    Mapit Driver App, you agree to be bound by this Agreement and understand that there is no tolerance for objectionable
    content. If you do not agree with the terms and conditions of this Agreement, you are not entitled to use the Mapit Driver App.
    In order to ensure Mapit provides the best experience possible for everyone, we strongly enforce a no tolerance policy for objectionable content.
  `,
  parts: [
    {
      title: "1. Parties This Agreement is between",
      content: "You and Mapit only, and not Apple nor Google .Notwithstanding the foregoing, you acknowledge that Apple, Google and their subsidiaries are third party beneficiaries of this Agreement and Apple or Google has the right to enforce this Agreement against you. Mapit, not Apple nor Google, is solely responsible for the Mapit Driver App and its content."
    },
    {
      title: "2. Privacy",
      content: "Mapit may collect and use information about your usage of the Mapit Driver App, including certain types of information from and about your device. Mapit may use this information, as long as it is in a form that does not personally identify you, to measure the use and performance of the Mapit Driver App."
    },
    {
      title: "3. Location Data",
      content: "Mapit uses location data in order to properly provide the Mapit Driver App services. Receiving and arranging customer orders and live tracking will not work properly without using location data. Location data are not used for any other purpose than providing these functionalities, and are not stored or shared with any third parties."
    },
    {
      title: "4. Limited License",
      content: "Mapit grants you a limited, non-exclusive, non-transferable, revocable license to use the Mapit Driver App for your commercial purposes. You may only use the Mapit Driver App on iOS/Android devices that you own or control and as permitted by the App Store Terms of Service."
    },
    {
      title: "5. Age Restrictions",
      content: "By using the Mapit Driver App, you represent and warrant that (a) you are 17 years of age or older and you agree to be bound by this Agreement; (b) if you are under 17 years of age, you have obtained verifiable consent from a parent or legal guardian; and (c) your use of the Mapit Driver App does not violate any applicable law or regulation. Your access to the Mapit Driver App may be terminated without warning if Mapit believes, in its sole discretion, that you are under the age of 17 years and have not obtained verifiable consent from a parent or legal guardian. If you are a parent or legal guardian and you provide your consent to your child's use of the Mapit Driver App, you agree to be bound by this Agreement in respect to your child's use of the Mapit Driver App."
    },
    {
      title: "6. Objectionable Content Policy",
      content: "Content may not be submitted to Mapit, who will moderate all content and ultimately decide whether or not to post a submission to the extent such content includes, is in conjunction with, or alongside any, Objectionable Content. Objectionable Content includes, but is not limited to: (i) sexually explicit materials; (ii) obscene, defamatory, libelous, slanderous, violent and/or unlawful content or profanity; (iii) content that infringes upon the rights of any third party, including copyright, trademark, privacy, publicity or other personal or proprietary right, or that is deceptive or fraudulent; (iv) content that promotes the use or sale of illegal or regulated substances, tobacco products, ammunition and/or firearms; and (v) gambling, including without limitation, any online casino, sports books, bingo or poker."
    },
    {
      title: "7. Shipping information",
      content: "Shipping information and data like customer phone numbers and addresses may not be used personally or may be kept private. It is not permissible to publish any information or data and infringe any of the rights of the third party."
    },
    {
      title: "8. Warranty",
      content: "Mapit disclaims all warranties about the Mapit Driver App to the fullest extent permitted by law. To the extent any warranty exists under law that cannot be disclaimed, Mapit, not Apple nor Google, shall be solely responsible for such warranty."
    },
    {
      title: "9. Maintenance and Support",
      content: "Mapit does provide minimal maintenance or support for it but not to the extent that any maintenance or support is required by applicable law, Mapit, not Apple nor Google, shall be obligated to furnish any such maintenance or support."
    },
    {
      title: "10. Product Claims",
      content: "Mapit, not Apple nor Google, is responsible for addressing any claims by you relating to the Mapit Driver App or use of it, including, but not limited to: (i) any product liability claim; (ii) any claim that the Mapit Driver App fails to conform to any applicable legal or regulatory requirement; and (iii) any claim arising under consumer protection or similar legislation. Nothing in this Agreement shall be deemed an admission that you may have such claims."
    },
    {
      title: "11. Third Party Intellectual Property Claims",
      content: "Mapit shall not be obligated to indemnify or defend you with respect to any third-party claim arising out or relating to the Mapit Driver App. To the extent Mapit is required to provide indemnification by applicable law, Mapit, not Apple nor Google, shall be solely responsible for the investigation, defense, settlement and discharge of any claim that the Mapit Driver App or your use of it infringes any third-party intellectual property right."
    }
  ]
}

const PrivacyPolicy = () => {

  const { t, i18n } = useTranslation();
  const [state, setState] = useState({});

  const getPrivacyPolicy = async _ => {
    try {
      const response = await HttpService.get(`${apiUrl}/v1/website/home`);
      const { settings } = response.data.body
      const privacyPolicy = pick(settings,
        [
          "privacy_ar",
          "privacy_en",
        ]
      )
      setState(privacyPolicy)
    } catch (e) {
      console.log(e)
      if (e.response)
        console.log(e.response)
    }
  }

  useEffect(() => {
    getPrivacyPolicy()
  }, [])

  return (
    <>
      <Helmet>
        <title>Privacy Policy | {$APP_NAME}</title>
      </Helmet>
      <Container sx={{ height: "100%", width: "100%", py: 3, }}>
        <Typography m={2} component="h1" variant="h2">
          {t("Privacy Policy")}
        </Typography>
        {/* <Typography m={2} variant="body1">
          {i18n.dir() === "rtl" ? state.privacy_ar : state.privacy_en}
        </Typography> */}
        <Typography m={2} variant="h5">
          {privacy.intro}
        </Typography>
        {
          privacy.parts.map(part => (
            <>
              <Typography m={2} variant="h6">
                {part.title}
              </Typography>
              <Typography m={2} variant="body1">
                {part.content}
              </Typography>
            </>
          ))
        }
        <Box sx={{height: 50}}/>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
