import React, { useState } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import SyntaxHiglighter from 'react-syntax-highlighter';
import shades_of_purple from 'react-syntax-highlighter/dist/esm/styles/hljs/shades-of-purple'
import './sass/App.scss';

function PermissionButton({ enabled, setPermission, permissionType, colour }) {
    const [{ x, y, scale }, set] = useSpring(() => ({
        x: 0, y: 0,
        scale: 1,
        config: config.wobbly,
    }));
    const bind = useDrag(({ down, movement: [mx, my], swipe: [swipeX, swipeY], distance, cancel}) => {
        set({y: down ? my : 0, scale: down ? my : 1});
        if (down && my !== 0 && distance > 100) {
            cancel(setPermission(!enabled));
        }
    }, {axis: 'y'});
    const scaleProps = scale.interpolate(o => Math.abs(o)).interpolate({
        range: [0, 200],
        output: [1, 3.5]
    })
    return (
        <animated.div {...bind()} style={{ x, y, scale: scaleProps }}>
            <div className={`softButton softButton-${colour}`}>
                {enabled ? permissionType : "-"}
            </div>
        </animated.div>
    );
}

const translateToDecimal = (permissions) => {
    let value = 0;
    for (let i = 0; i < 3; i++) {
        const accessor = 2 - i;
        const permission = permissions[accessor];
        value += permission ? 2**i : 0;
    }
    return value;
}

function App() {
    const [userRead, setUserRead] = useState(false);
    const [userWrite, setUserWrite] = useState(false);
    const [userExecute, setUserExecute] = useState(false);
    const [groupRead, setGroupRead] = useState(false);
    const [groupWrite, setGroupWrite] = useState(false);
    const [groupExecute, setGroupExecute] = useState(false);
    const [otherRead, setOtherRead] = useState(false);
    const [otherWrite, setOtherWrite] = useState(false);
    const [otherExecute, setOtherExecute] = useState(false);

    const userVal = translateToDecimal([userRead, userWrite, userExecute]);
    const groupVal = translateToDecimal([groupRead, groupWrite, groupExecute]);
    const otherVal = translateToDecimal([otherRead, otherWrite, otherExecute]);
    const code = '$   chmod 775 dir/';

    const [{userNumber, groupNumber, otherNumber}, set] = useSpring(() => ({
        userNumber: 0,
        groupNumber: 0,
        otherNumber: 0,
        config: {
            duration: 200
        }
    }));

    set({
        userNumber: userVal,
        groupNumber: groupVal,
        otherNumber: otherVal
    });
    return (
        <div className="App">
            <h1>
                UNIX file permissions
            </h1>
            <p>
                A handly tool for converting betwen <b>*nix</b> file permissions to the 3-digit code used by the <code>chmod</code> command.
            </p>
            {/* <SyntaxHiglighter language="shell" style={shades_of_purple}>
                {code}
            </SyntaxHiglighter> */}
            <div className="flex">
                <div className="buttonGroup-container buttonGroup-container-light-purple">
                    <h3>User permissions</h3>
                    <div className="buttonGroup">
                        <PermissionButton permissionType="r" enabled={userRead} setPermission={setUserRead} colour="light-purple" />
                        <PermissionButton permissionType="w" enabled={userWrite} setPermission={setUserWrite} colour="light-purple"/>
                        <PermissionButton permissionType="x" enabled={userExecute} setPermission={setUserExecute} colour="light-purple"/>
                    </div>
                </div>
                <div className="buttonGroup-container buttonGroup-container-light-green">
                    <h3>Group permissions</h3>
                    <div className="buttonGroup">
                        <PermissionButton permissionType="r" enabled={groupRead} setPermission={setGroupRead} colour="light-green" />
                        <PermissionButton permissionType="w" enabled={groupWrite} setPermission={setGroupWrite} colour="light-green"/>
                        <PermissionButton permissionType="x" enabled={groupExecute} setPermission={setGroupExecute} colour="light-green"/>
                    </div>
                </div>
                <div className="buttonGroup-container buttonGroup-container-light-blue">
                    <h3>Other permissions</h3>
                    <div className="buttonGroup">
                        <PermissionButton permissionType="r" enabled={otherRead} setPermission={setOtherRead} colour="light-blue" />
                        <PermissionButton permissionType="w" enabled={otherWrite} setPermission={setOtherWrite} colour="light-blue"/>
                        <PermissionButton permissionType="x" enabled={otherExecute} setPermission={setOtherExecute} colour="light-blue"/>
                    </div>
                </div>
            </div>
            <div className="outputNumbers-container">
                <h3 style={{marginRight: '10px'}}>
                    Number to use
                </h3>
                <div className="outputNumbers-number">
                    <animated.span>{userNumber.interpolate(n => Math.floor(n))}</animated.span>
                </div>
                <div className="outputNumbers-number">
                    <animated.span>{groupNumber.interpolate(n => Math.floor(n))}</animated.span>
                </div>
                <div className="outputNumbers-number">
                    <animated.span>{otherNumber.interpolate(n => Math.floor(n))}</animated.span>
                </div>
            </div>
        </div>
    )
}

export default App;
