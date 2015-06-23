# [progress-bars](https://github.com/PSDCoder/progress-bars) [![Build Status](https://travis-ci.org/PSDCoder/progress-bars.svg?branch=master)](https://travis-ci.org/PSDCoder/progress-bars)

## Changes history you can find [here](https://github.com/PSDCoder/progress-bars/blob/master/CHANGES.md) 

# Main features

* Independent from **$digest** cycle (don't run unnecessary cycles)
* Can place many progress bars on one page
* Full control of each bar
* Custom progress-bar container
* Simple customization via css

# Demo

You can see demo on [this page](http://psdcoder.github.io/progress-bars/demo/index.html)

# Installation

* Via bower (preferred way)

```bash
bower install --save pg.progress-bars
```
* [Download zip package](https://github.com/PSDCoder/progress-bars/archive/master.zip)

# Usage

1. Add module as dependency to your app:

```javascript
angular.module('your-app', ['pg.progress-bars']);
```

2. Add [**progress bar directive**](#progressbar-directive) to template:

```html
<pg-progress-bar name="some-name"></pg-progress-bar>
```

3. Now you can inject [**ProgressBarsStorage**](#progressbarsstorage-service) service and get full control of your progress bars.  
Just get it by name:

```javascript
var progressBar = ProgressBarsStorage.get('some-name');

progressBar.start();

setTimeout(function () {
    //async result
    progressBar.done();
}, 1500);
```

4. Default progress bar styles you can find in [demo/styles.css](https://github.com/PSDCoder/progress-bars/blob/master/demo/styles.css) (at the bottom of file).

# Module's components

* [**progressBar directive**](#progressbar-directive) - directive for adding progress bar to the page.
* [**ProgressBarFactory**](#progressbar-factory) - main progress bar constructor.
* [**ProgressBarsSettings provider**](#progressbars-provider) provider - allows to define base classes for progress bar
* [**ProgressBarsStorage service**](#progressbarsstorage-service) - all [**<pg-progress-bar></pg-progress-bar> directives**](#progressbar-directive) registers in this storage.

## progressBar directive
Directive will be replaced by its template. For customization different progress bars you can add classes to it. It will be merged with template classes.

#### Usage

```html
<pg-progress-bar name="main"></pg-progress-bar>
```

#### Directive params

|Name|Binding Type|Default value|Description|Example|
|----|------------|-------------|-----------|-------|
|name|```@```||You must specify name of each progress bar for get it then through [**ProgressBarsStorage**](#progressbarsstorage-service)|```<pg-progress-bar name="main"></pg-progress-bar>```|
|minimum|```@```|```8```|Minimum value from which started progress bar|```<pg-progress-bar name="main" minimum="25"></pg-progress-bar>```|
|speed|```@```|```250```|Speed of each width increasing|```<pg-progress-bar name="main" speed="500"></pg-progress-bar>```|
|trickleRate|```@```|```2```|Multiplier of each increasing of width when progress bar is running|```<pg-progress-bar name="main" trickle-rate="5"></pg-progress-bar>```|
|trickleSpeed|```@```|```300```|Multiplier of each increasing of width when progress bar is running|```<pg-progress-bar name="main" trickle-rate="5"></pg-progress-bar>```|
|animation|```@```|```'ease-out'```|Type of css animation|```<pg-progress-bar name="main" animation="linear"></pg-progress-bar>```|

#### Base progress bar template structure

```html
<div class="progress__container"><div class="progress__bar"></div></div>
```

#### Full example

```html
<pg-progress-bar
    name="main"
    minimum="15"
    speed="350"
    trickle-rate="4"
    trickle-speed="400"
    animation="linear">
</pg-progress-bar>
```

## ProgressBar factory

Don't use it directly, it will be constructed when you use ```html <pg-progress-bar></pg-progress-bar>``` directive.
Then you can get instance of ProgressBar class from [**ProgressBarsStorage**](#progressbarsstorage-service) and use methods.  
You can combine method calls to chain (only for non-get methods). Example:
```javascript
progressBar.start().inc().inc();
```

#### Public methods description

|Method|Params|Returns|Description|Example|
|------|------|-------|-----------|-------|
|**start**||```this```|Start progress bar. It will constantly increase its width value prior to calling **done** or **stop** method|```progressBar.start()```|
|**stop**||```this```|Stop increasing value of width|```progressBar.stop()```|
|**done**||```this```|Complete progress bar work|```progressBar.done()```|
|**get**||```{number} - width value```|Get current width of progress bar|```progressBar.get()```|
|**set**|```{number} value```|```this```|Set width of progress bar|```progressBar.set(45)```|
|**inc**|```{number} [value]```|```this```|Increase value of progress bar to specified value or random value if it not specified|```progressBar.inc(); progressBar.inc(15)```|
|**isInProgress**||```{boolean} - is running value```|Whether running or not progress bar now|```progressBar.isInProgress()```|

## ProgressBarsSettings provider

You can use this methods only in config block.
All methods returns ```this``` so you can chaining methods calls.
For default values I used [BEM](http://bem.info/method/definitions/) methodology class naming convention.

|Method|Params|Default Value|Description|Example|
|------|------|-------------|-----------|-------|
|**setContainerClass**|```{string} className```|```progress__container```|Set container's class.|```ProgressBarsSettingsProvider.setContainerClass('progress-container')```|
|**setBarClass**|```{string} className```|```progress__bar```|Set progress bar's class.|```ProgressBarsSettingsProvider.setContainerClass('progress-bar')```|
|**setShowingClass**|```{string} className```|```progress__container_showing```|Set container's class which will be added when progress bar is running.|```ProgressBarsSettingsProvider.setShowingClass('progress-bar-showing')```|

## ProgressBarsStorage service
This service has only one public method: **get**. With this method you can get [**ProgressBar instance**](#progressbar-constructor) and use its methods.  
**Example**:

```javascript
var mainProgressBar = ProgressBarsStorage.get('main');
var completed = false;

mainProgressBar.start();

var getInterval = setInterval(function () {
    if (completed) {
        clearInterval(getInterval);
    }

    console.log(mainProgressBar.get());
}, 1000);

setTimeout(function () {
    mainProgressBar.done();
    completed = true;
}, 5000);
```
