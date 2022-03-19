#/bin/bash
##################################################################################
## ONLY RUN THIS FILE TO UPDATE THE WHOLE PROJECT DELIVERABLES.
##################################################################################

PROJECTDIR="$REPO_VANILLAJS" ;
APPSDIR="$PROJECTDIR/apps" ;

##++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
## FUNCTION DEFINITIONS
##++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
####
function FUNC1_COPY_MAIN_NAVBAR_JS_TO_ALL_APPS () {
    ## Copy main navbar loader js script to all apps
    JSNAVBAR_MAIN="$PROJECTDIR/js/loadNavigationBar.js" ;
    ## FIND AND REPLACE EXISTING JS FILES
    fd -I --search-path="$APPSDIR" 'loadNavigationBar.js' -x cp "$JSNAVBAR_MAIN" {} ; 
}
####
function FUNC2_CREATE_INDEX_HOMEPAGE_LISTING_ALL_CURRENT_APPS () {
    HOMEPAGE_MAIN_HTML="$PROJECTDIR/index.html" ;
    HOMEPAGE_BS_HEADER="$PROJECTDIR/homepage_bs_header.txt" ; 
    HOMEPAGE_BS_FOOTER="$PROJECTDIR/homepage_bs_footer.txt" ;
    ##
    TMPFILE="$DIR_Y/_tmp0.txt" ; 
    echo > $TMPFILE ## initialize this file
    ##
    ## CREATING HOMEPAGE CONTENT FROM APPS DIRECTORIES     
    for appSubDir in $(fd -I -t d -d1 --search-path="$APPSDIR"); do
        ##
        echo ">> Found app sub dir => $appSubDir" ; 
        ##
        appSubDir_basename=$(basename $appSubDir) ;
        echo "<div class='mb-3 border border-5 rounded bg-primary'>" >> $TMPFILE
        echo "<a href='apps/$appSubDir_basename/index.html'>$appSubDir_basename" >> $TMPFILE
        echo "</div>"  >> $TMPFILE
    done
    ##    
    ## FINALLY, DUMPING ALL HOMEPAGE COMPONENTS
    cat $HOMEPAGE_BS_HEADER > $HOMEPAGE_MAIN_HTML ;
    cat $TMPFILE >> $HOMEPAGE_MAIN_HTML ;
    cat $HOMEPAGE_BS_FOOTER >> $HOMEPAGE_MAIN_HTML ; 
}
##++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

## CALL FUNCTIONS
FUNC1_COPY_MAIN_NAVBAR_JS_TO_ALL_APPS ; 
FUNC2_CREATE_INDEX_HOMEPAGE_LISTING_ALL_CURRENT_APPS ; 

## FINAL MESSAGE
figlet "VANILLA-JS PROJECT UPDATED." ; 




