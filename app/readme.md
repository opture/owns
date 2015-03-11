readme.txt


--
Structure for app
--

```
<div app>
  <div sidebar>
    <div sidebar-inner>
    </div>
  </div>
  <div main>
    <div container></div>
  </div
  <div topbar>
    <div togglesidebar></div>
  </div>
</div>
```

###Behavioral attributes
#### app
Defines the root for the application, add attributes for sidebar and topbar behavior.

* sidebar-foldin
* sidebar-slidein
* topbar-hideonscroll
 

#### main
Where content is placed this is set as scrollable
Add ```<div container></div> ``` to make the content responsive.
#### sidebar
Sidebar drawer, place the content for the sidebar in sidebar-inner. The inner element is needed for the foldin animation. 
#### topbar
The topbar


Layout attributes
-----
 fit
-----
Sets the element to the max size of its parent or the window.
(position:absolute;top,bottom,right,left to 0;)
Needs to have a relative or absolute positioned parent.

##Columns (Grid style)
Sets the width of the container to fit for X column layout.
This is not a floating grid, it uses inline-block, its easier to left, center and right align.

###min-320-col-[X]
320-479 pixels screenwidth
###min-480-col-[X]
480-767 pixels screenwidth
###min-768-col-[X]
768-991 pixels screenwidth
###min-992-col-[X]
992-^ picels screenwidth
--------------
 shadow-z-[z]
--------------
[z] -> 1-4
creates a shadow with a spread depending on z value

----------------
 margin-[value]
----------------
[value] > 1-8
Sets the margin to multiples of quarter of an rem
ie. 1=0.25rem, 2=0.5rem, 3=0.75rem ... 8=2rem.

---------------------------
 margin-[side]-[value]
---------------------------
[side] -> top, right, bottom, left
[value] -> 1-8

-----------------
 padding-[value]
-----------------
[value] > 1-8
Sets the padding to multiples of quarter of an rem
ie. 1=0.25rem, 2=0.5rem, 3=0.75rem ... 8=2rem.

------------------------
 padding-[side]-[value]
------------------------
[side] -> top, right, bottom, left
[value] -> 1-8
Sets the padding of the specified side to multiples of quarter of an rem
ie. 1=0.25rem, 2=0.5rem, 3=0.75rem ... 8=2rem.
