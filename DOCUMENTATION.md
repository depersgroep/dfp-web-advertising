Web advertising project
=====================

# Asynchronous

Implement responsive ads in an **asynchronous** manner using the dfp-async.js library.

## Usage

### Add dependencies

* Add the Google GPT JavaScript to the **head**-element, after which we add our empty dfp object.

````html
<script src="//www.googletagservices.com/tag/js/gpt.js" async="true"></script>
<script>
    var dfp = dfp || {};
    dfp.cmd = dfp.cmd || [];
</script>
````

* Copy dist/dfp.(min.)js from the **node_modules/persgroep-web-advertising** directory, to your repository and add it asynchronously to the **head**-element

```html
<script src="<path-to-your-javascript-files>/dfp-async.js" async="true"></script>
```

### Call init

Call dfp.init() within the dfp.cmd.push() and pass along the required parameters

```javascript
dfp.cmd.push(function() {
    dfp.init(opts, targeting, slots);
});
```

#### Options

* Type: object

Name    | Type | Info
------------- | -------- | -------
tag        | object       | Google DFP network id & ad unit structure
shortTargetNames | boolean | Use short target names (ex: 'position' vs 'pos') (default: false)
async        | boolean       | Load ads asynchronously (default: true)
singleRequest        | boolean       | Enable single request (default: true)
collapseEmpty        | boolean       | Collapse empty divs (default: true)
ppid  | string  | Set the publisher provided id
requestNonPersonalizedAds  | boolean  | Disable personalized ads (1 = disable; 0 = enable);
breakpoints        | array       | Breakpoints of the website
callbacks        | object       | Callback functions

##### Tag

````javascript
var tag = {
	networkId: 1111,
        adUnit: 'example/example.site-%screenSize%/default'
};
````

##### Breakpoints

````javascript
var breakpoints = [
	{
        'name': 'small',
        'begin': 320,
        'end': 767
    }, {
        'name': 'medium',
        'begin': 768,
        'end': 983
    }, {
        'name': 'large',
        'begin': 984,
        'end': Infinity
    }
];
````

##### Callbacks

It's possible to add your own custom callback functions. These will be appended on window.dfp-object. Not allowed callback-functions: init and  loadSlot

````javascript
var callbacks = {
	'renderEnded': function(domId, isEmpty, size) {},
	'resize': function(initialBreakpoint) {},
	'orientationChange': function(initialBreakpoint) {},
	'showHPTO': function(obj) {},
	'showNative': function(obj) {},
	'onInreadOpened': function(obj) {},
	'onInreadClosed': function(obj) {},
	'resizeCreative': function(domId, obj) {},
	'hideCreative': function(domId) {},
	'makeSticky': function(domId) {}
}
````

###### RenderEnded callback

````javascript
function renderEnded(domId, isEmpty, size) {
	// do stuff
}
````

Name    | Type | Info
------------- | -------- | -------
domId        | string       | DOM ID of the loaded ad slot.
isEmpty        | boolean       | Is the slot empty?
size        | array       | Size of the loaded slot

###### Resize callback

````javascript
function resize(initialBreakpoint) {
	// do stuff
}
````

Name    | Type | Info
------------- | -------- | -------
initialBreakpoint        | boolean       | Is the "new" breakpoint (after resize) the same as the initial breakpoint?

##### OrientationChange callback

````javascript
function orientationChange(initialBreakpoint) {
	// do stuff
}
````

Name    | Type | Info
------------- | -------- | -------
initialBreakpoint        | boolean       | Is the "new" breakpoint (after orientation change) the same as the initial breakpoint?

##### showHPTO callback

````javascript
function showHPTO(obj) {
	// do stuff
}
````

Name    | Type | Info
------------- | -------- | -------
obj        | object       | Object containing data to display a HPTO without the use of a Rich Media Provider

##### showNative callback

````javascript
function showNative(articleId, domId, clickUrl, obj) {
	// do stuff
}
````

Name    | Type | Info
------------- | -------- | -------
articleId        | string       | Id of the native article
domId        | string       | Id of domElement where you want to show the native ad
clickUrl        | string       | Url that needs to be prepended to the article url
obj        | object       | Object containing the optional data

###### Obj

````javascript
var obj = {
	'sponsoredBy': 'De persgroep',
	'imageUrl': 'http://www.persgroep.be/sites/all/themes/persgroep/i/images/persgroep-logo-belgie.png',
	'articleTitle': 'Custom title for the article'
};
````

##### onInreadOpened callback

````javascript
function onInreadOpened() {
	// do stuff
}
````

##### onInreadClosed callback

````javascript
function onInreadClosed() {
	// do stuff
}
````

##### resizeCreative callback

````javascript
function resizeCreative(domId, obj) {
	// do stuff
}
````

Name    | Type | Info
------------- | -------- | -------
domId        | string       | DomId of the slot which contains the iframe that should be resized
obj        | object       | Object containing width and height

##### hideCreative callback

````javascript
function hideCreative(domId) {
	// do stuff
}
````

Name    | Type | Info
------------- | -------- | -------
domId        | string       | DomId of the slot that should be hidden

##### makeSticky callback

````javascript
function makeSticky(domId) {
	// do stuff
}
````

Name    | Type | Info
------------- | -------- | -------
domId        | string       | DomId of the slot that should be sticky

#### Targeting

* Type: object

Anything can be send to DFP, as long as the value is of the type Object (array), String, Number or Boolean.

#### Slots

* Type: array of objects

If you have an outofpage, no need to include sizes (and vice versa)

Name    | Type | Info
------------- | -------- | -------
domId        | string       | DOM ID of the to be loaded ad slot
outofpage        | boolean       | Whether or not an OutOfPage is included
sizes        | object       | Sizes per breakpoint per ad slot
targeting        | object       | Targeting key-value pairs associated with the slot

##### Sizes

````javascript
var sizes = {
	'large': [[300, 600]],
	'medium': [[300, 600]],
	'small': []
}
````

### Call loadSlot

Call dfp.loadSlot() within the dfp.cmd.push() function and pass along the required parameters

If there is only one slot for the same AD-type, pass the DOM id as first parameter. The second parameter
let's you choose on which breakpoint you'd wish to display the ad.
```html
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
```

If there are multiple slots with the same AD-type, pass the DOM element as first parameter
and add data-id attribute containing the id used in the init configuration
(ex: if slots should be displayed on different places for different sizes)

```html
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
```

### Call refreshSlot

Call dfp.refreshSlot() within the dfp.cmd.push() function to refresh an existing slot. With the third parameter you have the option to override (true) or append (false) the targeting values.

Make sure you don't refresh a slot that has been hidden in your resize-callback.
```javascript
<script>
    dfp.cmd.push(function() {
        dfp.refreshSlot('leader--1', {
            'targeting': {
                'key0': 'value0',
                'key1': 'value1',
            },
            false // All previously set targeting parameters will be cleared
        })
    });
</script>
```

### Call refreshSlots

Call dfp.refreshSlots() within the dfp.cmd.push() function to refresh an array of existing slots. This is helpful in case you're using a master/companion ad (ex: 3AD).

Make sure you don't refresh your slots that have been hidden in your resize-callback.
```javascript
<script>
    var slots = [
        {
            'domId': 'leader--1';
            'targeting': {
                'key00': 'value00'
            },
            'overrideSlotTargeting': false
        },
        {
            'domId': 'sky--1';
            'targeting': {
                'key11': 'value11'
            },
            'overrideSlotTargeting': true // All previously set targeting parameters for this slot will be cleared
        }
    ];

    dfp.cmd.push(function() {
        dfp.refreshSlot(slots);
    });
</script>
```

#### Options

* Type: object
* Required: yes

Name    | Type | Info
------------- | -------- | -------
breakpoints        | object       | Define on which breakpoints the ad should load

##### Breakpoints

The code below means that the ad will load if the viewport matches the "large"-breakpoint, but not if the viewport matches the "small"-breakpoint. If the
breakpoint is not defined here, then the ad won't load on that breakpoint either.

````javascript
var breakpoints = {
	'large': true,
	'small': false
}
````
