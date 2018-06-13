# DFP implementation guide

## Installing our script 
Install the script by adding the web-advertising script to your package.json file. 

package.json

````javascript
"dependencies": {
  "dfp-web-advertising": "^4.0.0"
}
````

Or by using
````javascript
npm install --save-dev dfp-web-advertising
````

> We use the principle of Semantic versioning - 3 `MAJOR`. 2 `MINOR`. 0 `PATCH`. As long as the major number doesn’t raise, it is not "breaking". As most of you know, we are a big supporter of the evergreen principle and we also expect every `MINOR` & `PATCH` update to happen automatically.


The build folder contains following files:

| Files        | Info           |
| ------------- |:-------------:|
| dfp.js | Main script |
| dfp.min.js | ↳ minified |
| dfp-helpers.js | Utility script |
| dfp-helpers.min.js | ↳ minified |
| dfp-krux.js | Krux add-on |
| dfp-krux.min.js | ↳ minified |

Our script can be loaded synchronously as well as asynchronously. For best practices, we'll be using async examples in this guide. To use this script synchronously, you may ignore any reference towards dfp.cmd().

Let's start by adding the following script in your `<head>`

````javascript
<script>
    var dfp = dfp || {};
    dfp.cmd = dfp.cmd || [];
</script>

<script src="https://www.googletagservices.com/tag/js/gpt.js" async="true"></script>

<script src="../dist/dfp-krux.js"></script>
<script src="../dist/dfp-helpers.js"></script>
<script src="../dist/dfp.js" async="true"></script>
````

## Configuration

Add your setup after and initialize the script

````javascript
var opts = {
    'tag': {
        networkId: 1111,
        adUnit: 'example/example.site-%screenSize%/default'
    },
    'async': true,
    'singleRequest': true,
    'collapseEmpty': true,
    'disableInitialLoad': false,
    'ppid': '12hjDojdj2JHK32228FHKJBskMOI2ndnjndn',
    'requestNonPersonalizedAds': 1,
    'breakpoints': [...],
    'callbacks': {...}
},
targeting = {...},
slots = [...];

dfp.cmd.push(function() {
    dfp.init(opts, targeting, slots);
});
````

### Options
* Optional

#### tag.networkId
_**1111:**_ Your Googletag networkId

#### tag.adUnit
[adunit-name]/[adunit-name].site-%screenSize%/[category]
This pattern is an example of how we organize our adUnits. Make sure that **%screenSize%** is included in the adUnit.

Example: `example/example.site-%screenSize%/default`

#### async *
Default **true**

**true**: Enables async rendering mode to enable non-blocking fetching and rendering of ads.

#### singleRequest *
Default **true**

**true**: Enables single request mode for fetching multiple ads at the same time.

#### collapseEmpty *
Default **true**

**true**: Enables collapsing of slot divs so that they don't take up any space on the page when there is no ad content to display.

#### disableInitialLoad *
Default **false**

**true**: Disables requests for ads on page load, which enables lazy loading.

#### requestNonPersonalizedAds *
Default **1**

**0**: Enables personalized ads.

#### ppid *
Default **false**

The Publisher provided identifier (PPID) allows publishers to send DoubleClick for Publishers an identifier for use in frequency capping, audience segmentation and targeting, sequential ad rotation and other audience-based ad delivery controls across devices.

#### breakPoints
Array of breakpoints, whenever a resize event is fired a recalculation is triggered to hide slots on predesignated breakpoints.

_Example_

````javascript
'breakpoints': [{
    'begin': 0,
    'end': 767,
    'name': 'small'
}, {
    'begin': 768,
    'end': 983,
    'name': 'medium'
}, {
    'begin': 984,
    'end': Infinity,
    'name': 'large'
}]
````

#### Callbacks
You can use existing callbacks which are triggered at certain key points during the script execution.

_**renderEnded:**_
This event is fired when the creative code is injected into a slot. This event will occur before the creative's resources are fetched, so the creative may not be visible yet.

_**resize:**_
Fired on resize event

_**orientation:**_
Triggered on orientation change

You can also create custom events which can easily be called from within any creative.

_Example_

> Be advised: functions like addClass, removeClass as you see in the example come from our dfp-helpers.js file. 

````javascript
'callbacks': {
    'renderEnded': function(domId, isEmpty, size) {
        addClass(document.getElementById(domId), isEmpty ? 'js-is-empty' : 'js-is-not-empty');
    },
    'resize': function(initialBreakpoint) {
        var html = document.head.parentNode,
            cls = 'js-ads-breakpoint-hide-resize';

        if (initialBreakpoint) {
            removeClass(html, cls);
        } else {
            addClass(html, cls);
        }
    },
}
````

### Targeting
Sets custom targeting parameters for a given key that apply to all pubads service ad slots.

_Example_

````javascript
targeting = {
    'wtype': 'TROPICAL_STORM', /* Comes from backend */
    'wcur': 2, /* Comes from backend */
    'wmin': 2, /* Comes from backend */
    'wmax': 2, /* Comes from backend */
    'wrain': 2, /* Comes from backend */
    'wwind': 7, /* Comes from backend */
}
````

### Slots
Each slot contains the following properties:

_**domId:**_html elements ID or data-id attribute

_**sizes:**_Available slots sizes [width, height] for each breakpoint

_**targeting:**_local slot targeting key/values

_Example_

````javascript
slots = [
    {
        'domId': 'leader--1',
        'sizes': {
            'large': [[970, 250]],
            'medium': [[970, 250]],
            'small': [[970, 250]]
        },
        'targeting': {
            'pos': 'leader1'
        }

    }, {
        'domId': 'sky--1',
        'sizes': {
            'large': [[300, 600]],
            'medium': [[300, 600]],
            'small': [[300, 600]]
        },
        'targeting': {
            'pos': 'sky1'
        }
    }, {
        'domId': 'imu--1',
        'sizes': {
            'large': [[300, 250], [320, 100]],
            'medium': [[320, 250],
            'small': []
        },
        'targeting': {
            'pos': 'imu1'
        }
    }
]
````

## Load a slot
Call `dfp.loadSlot()` within the `dfp.cmd.push()` function and pass along the required parameters

If there is only one slot for the same AD-type, pass the DOM id as first parameter

````javascript
<div id="leader--1" class="dfp">
    <script>
           dfp.cmd.push(function() {
               dfp.loadSlot('leader--1', {
                   'breakpoints': {
                       'large': true,
                       'medium': false,
                       'small': false
                   }
               })
           });
    </script>
</div>
````

If there are multiple slots with the same ADslot-id, pass the DOM element as first parameter
and add data-id attribute containing the id used in the init configuration
(ex: if slots should be displayed on different places for different sizes)

````javascript
<div class="dfp fjs-leaderboard-1" data-id="leader--1"></div>
<script>
   dfp.cmd.push(function() {
       var elm = document.querySelector('.fjs-leaderboard-1');
       window.dfp.loadSlot(elm, {
           'breakpoints': {
               'large': true,
               'medium': false,
               'small': false
           }
       });
   })
</script>

<div class="dfp fjs-leaderboard-2" data-id="leader--1"></div>
<script>
   dfp.cmd.push(function() {
       var elm = document.querySelector('.fjs-leaderboard-2');
       window.dfp.loadSlot(elm, {
           'breakpoints': {
               'large': false,
               'medium': false,
               'small': true
           }
       });
   })
</script>
````

To make use of the lazyload-feature make sure you include the `dfp-helpers.js` file and put your **loadSlot** within the **lazyload** function. The callback will be executed after attaining the set threshold (in pixel) below the viewport. The threshold is configurable by changing the **window.lazyloadthreshold** value.

````javascript
<script>
    var elemImu1 = document.getElementById("imu--1");

    window.lazyload(elemImu1, function() {
        dfp.cmd.push(function() {
            dfp.loadSlot('imu--1', {
                'breakpoints': {
                    'large': true,
                    'medium': true,
                    'small': true
                }
            })
        });
    })
</script>
````
