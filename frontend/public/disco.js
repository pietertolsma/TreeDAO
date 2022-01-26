
        console.log("HI");
        window.hue=0.0;
    window.disco_speed=1.0; // 4.0 = 1 css-hsl() hue point per second
    function discoLaserDanceRave () {
        $('.colors').css('background-color','hsl('+window.hue+',100%,50%)');
        window.hue+=window.disco_speed/4;
        if (window.hue>360) window.hue=window.hue-360;
        setTimeout(discoLaserDanceRave,10);
    }
    discoLaserDanceRave();

    console.log("hi");