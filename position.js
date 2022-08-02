import { use } from "./util";

const { cos, sin, tan, atan2, PI } = Math;

const position = (x, y, theta) => {
    const thetaRad = () => theta * PI / 180;
    return {
        x: (x_ = x) => x = x_,
        y: (y_ = y) => y = y_,
        theta: (theta_ = theta) => theta = theta_,
        toMat: () => use(thetaRad(), a => [cos(a), -sin(a), sin(a), cos(a), x, y]),
    }
};

export default position;