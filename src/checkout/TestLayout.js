import { Outlet } from "react-router-dom";
import { experimentalStyled } from "@material-ui/core";
import TestNavbar from './TestNavbar';

const TestLayoutRoot = experimentalStyled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
}));

const TestLayoutWrapper = experimentalStyled("div")({
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    // paddingTop: 64,
});

const TestLayoutContainer = experimentalStyled("div")({
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
});

const TestLayoutContent = experimentalStyled("div")({
    flex: "1 1 auto",
    height: "100%",
    overflow: "auto",
});

const TestLayout = (props) => {
    return (
        <TestLayoutRoot>
            <TestNavbar />
            <TestLayoutWrapper sx={{ pt: props.navbarVisible ? "64px" : "10vh" }}>
                <TestLayoutContainer>
                    <TestLayoutContent>
                        <Outlet />
                    </TestLayoutContent>
                </TestLayoutContainer>
            </TestLayoutWrapper>
        </TestLayoutRoot>
    );
};

export default TestLayout;
