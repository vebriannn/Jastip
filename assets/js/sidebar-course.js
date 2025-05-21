function elementFollowScroll(object, sectionContainer, topMargin, stopOn = false, footer) {
    $(window).on("scroll", function() {
        if ($(window).width() > 928) { 
            let originalY = sectionContainer.offset().top;
            let scrollTop = $(window).scrollTop();
            let footerTop = footer.offset().top; 
            let sidebarHeight = object.outerHeight(true); 
            let stopPoint = footerTop - sidebarHeight - topMargin; 

            if (stopOn === false) {
                let newTop = scrollTop < originalY ? 0 : scrollTop - originalY + topMargin;
                if (scrollTop + sidebarHeight + topMargin >= footerTop) {
                    object.stop(false, false).animate({ top: stopPoint - originalY }, 50);
                } else {
                    object.stop(false, false).animate({ top: newTop }, 50);
                }
            } else {
                let newTop = scrollTop < originalY ? 0 : Math.min(sectionContainer.height() - object.height() - 52, scrollTop - originalY + topMargin);
                if (scrollTop + sidebarHeight + topMargin >= footerTop) {
                    object.stop(true, true).animate({ top: stopPoint - originalY }, 50);
                } else {
                    object.stop(true, true).animate({ top: newTop }, 50);
                }
            }
        } else {
            // Prevent the sidebar from following the scroll on mobile
            object.stop(false, false).css({
                top: 0
            });
        }
    });
}

$(document).ready(function() {
    // Initialize sidebar sticky only if the window width is greater than 962 pixels
    const sidebar = $(".sidebar");
    const sectionContainer = $(".col-md-3");
    const topMargin = 90;
    const footer = $("footer"); 
    
    if ($(window).width() > 962) {
        elementFollowScroll(sidebar, sectionContainer, topMargin, false, footer);
    }
});