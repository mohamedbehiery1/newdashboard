import React from 'react';
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
} from "@material-ui/core";

const Detail = ({ title, detail }) => {
  const { t } = useTranslation();

  const statusColor = (_ => {
    if (title === "status") {
      return detail === t("driverDetails.tracking") ? "text.success" : "text.danger"
    }
    return null
  })()

  return (
    <Box key={title} sx={{ display: "flex", width: '100%', flexDirection: 'row', alignItems: 'center' }}>
      <Typography sx={{ fontSize: 13, }}>{`${t("driverDetails." + title)}: `}</Typography>
      <Typography sx={{ fontSize: 16, fontWeight: 'bold', marginInlineStart: 6, color: title === "status" && statusColor }}>{detail}</Typography>
    </Box>
  )
}

export default Detail;