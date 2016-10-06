# Copyright (c) Microsoft Corporation.  All rights reserved.

# Third Party Programs. This software enables you to obtain software applications from other sources. 
# Those applications are offered and distributed by third parties under their own license terms.
# Microsoft is not developing, distributing or licensing those applications to you, but instead, 
# as a convenience, enables you to use this software to obtain those applications directly from 
# the application providers.
# By using the software, you acknowledge and agree that you are obtaining the applications directly
# from the third party providers and under separate license terms, and that it is your responsibility to locate, 
# understand and comply with those license terms.
# Microsoft grants you no license rights for third-party software or applications that is obtained using this software.


##PBI_R_VISUAL: VIZGAL_CORRPLOT  Graphical display of a correlation matrix. 
# Computes and visualizes a correlation matrix. Used to investigate the 
# dependency between multiple variables at the same time. It also contains some algorithms 
# to do matrix reordering and grouping of variables.
# INPUT: 
# The input dataset should include at least two numerical non-constant columns  
#
# EXAMPLES:
#  #for R environment
#  dataset<-mtcars #assign dataset
#  source("visGal_corrplot.R") #create graphics
#
# WARNINGS:  
#
# CREATION DATE: 06/01/2016
#
# LAST UPDATE: 07/26/2016
#
# VERSION: 0.0.1
#
# R VERSION TESTED: 3.2.2
# 
# AUTHOR: B. Efraty (boefraty@microsoft.com)
#
# REFERENCES: https://cran.r-project.org/web/packages/corrplot/vignettes/corrplot-intro.html


#save(list = ls(all.names = TRUE), file='C:/Users/boefraty/projects/PBI/R/R_visuals_gallery/tempData.Rda')

getValueNumericMinMaxDefault = function(val,minVal = -Inf,maxVal = Inf,defVal = NA)
{
  if(!is.numeric(val) && !is.na(defVal))
    val = defVal
  
  if(val<minVal)
    val = minVal
  
  if(val>maxVal)
    val = maxVal
  
  return(val)
}



if(!exists("dataset") && exists("Values"))
  dataset = Values

#PBI_EXAMPLE_DATASET for debugging purposes 
if(!exists("dataset"))
{
  require("datasets")
  dataset=data.frame(mtcars) #mpg,cyl,disp,hp,drat,wt,qsec,vs,am,gear,carb
}

############ User Parameters #########



if(exists("settings1_show") && settings1_show == FALSE)
  rm(list= ls(pattern = "settings1_"))
if(exists("settings2_show") && settings2_show == FALSE)
  rm(list= ls(pattern = "settings2_"))
if(exists("settings3_show") && settings3_show == FALSE)
  rm(list= ls(pattern = "settings3_"))
if(exists("settings4_show") && settings4_show == FALSE)
  rm(list= ls(pattern = "settings4_"))
if(exists("settings5_show") && settings5_show == FALSE)
  rm(list= ls(pattern = "settings5_"))
  
##PBI_PARAM: Should warnings text be displayed?
#Type:logical, Default:TRUE, Range:NA, PossibleValues:NA, Remarks: NA
showWarnings = FALSE
if(exists("settings5_showWarnings"))
  showWarnings = settings5_showWarnings

##PBI_PARAM: visualization method of items inside the table
#Type:string, Default:'circle', Range:NA, PossibleValues:("circle", "square", "ellipse", "number", "shade", "color", "pie"), Remarks: NA
method = 'circle' 
if(exists("settings1_method"))
  method = settings1_method

##PBI_PARAM: layout type, defines if we display full, lower triangular or upper triangular matrix.
#Type:string, Default:'full', Range:NA, PossibleValues:("full", "upper", "lower"), Remarks: If rectangles are added, this option is switched to "full"
type = 'full' 
if(exists("settings1_mytype"))
  type = settings1_mytype

##PBI_PARAM: order of raws is one of  "original","hclust"(hierarchical clustering order), "alphabet", "AOE"(angular order of the eigenvectors), "FPC"( first principal component order)
#Type:string, Default:'original', Range:NA, PossibleValues:("original","hclust","alphabet", "AOE", "FPC"), Remarks: NA
order='original' 
if(exists("settings1_order"))
  order = settings1_order


##PBI_PARAM: number of clusters to be drawn on top of correlation matrix as rectangles 
#if order is "hclust" and type is "full" visual will draw rectangles around the correlation matrix
# addrect can also be integer or NULL (add nothing) or NaN (auto)
#Type:unsigned integer, Default:NaN, Range:NA, PossibleValues:NA, Remarks: If equals NaN, will find number automatically 
addrect= 0 
if(exists("settings1_addrect"))
{
  addrect = as.numeric(settings1_addrect)
  if(is.na(addrect) || addrect>1)
  {
    order='hclust'
    type = 'full'
  }
  
}
###############Library Declarations###############

libraryRequireInstall = function(packageName, ...)
{
  if(!require(packageName, character.only = TRUE)) 
    warning(paste("*** The package: '", packageName, "' was not installed ***",sep=""))
}

libraryRequireInstall("corrplot") 

###############Internal parameters definitions#################
##PBI_PARAM: color of text label
#Type:string, Default:'orange', Range:NA, PossibleValues:("red","black","green", "blue", "gray"), 
#Remarks: see colors() function for full list of built-in color names
tl.col = "red"
if(exists("settings3_tl_col"))
  tl.col = settings3_tl_col

##PBI_PARAM: font size of text label
#Type:numeric, Default:0.9, Range:(0,Inf], PossibleValues:NA, 
#Remarks: NA
tl.cex = 1
if(exists("settings3_textSize"))
  tl.cex = as.numeric(settings3_textSize)/10

##PBI_PARAM: Color of coefficients added on the graph. If NULL (default), add no coefficients
#Type:string, Default:NULL, Range:NA, PossibleValues:("white","black","green","gray",NULL), 
#Remarks: NA
addCoef.col = NA
if(exists("settings4_addCoef_col"))
  addCoef.col = (settings4_addCoef_col)

##PBI_PARAM: size of coefficients added on the graph. 
#Type:numeric, Default:0.6, Range:[0,1], PossibleValues:NA, 
#Remarks: NA
number.cex = 0.8
if(exists("settings4_textSize"))
  number.cex = as.numeric(settings4_textSize)/10


##PBI_PARAM: the number of decimal digits to be added into the plot
#Type:numeric, Default:1, Range:[1,3], PossibleValues:NA, 
#Remarks: NA
number.digits = 1*as.numeric(exists("settings4_show"))

if(exists("settings4_number_digits"))
{
  number.digits = as.numeric(settings4_number_digits)
  if(is.na(number.digits))
  {
    addCoef.col = NULL
    number.digits = 0
  }
}

if(number.digits == 0)
  addCoef.col = NULL

##PBI_PARAM: the default margin definition of the plot
#Type:vector, Default:c(1.0, 0.75, 0.75, 0.6), Range:NA, PossibleValues:NA, 
#Remarks: NA
defMar = c(0.5, 0.25, 0.25, 0.1) + 0.5
###############Internal functions definitions#################

#by default will group variables in log of number of columns clusters
autoDetectAddrect <- function(dataset) { ceiling(log(ncol(dataset))) }

#verify if the column is numeric and non-constant
correctColumn <- function(someColumn) { is.numeric(someColumn) && length(unique(someColumn)) > 1 }


###############Upfront input correctness validations (where possible)#################
pbiWarning <- NULL      

#PBI_COMMENT: verify correctness of dataset
useColumns <- sapply(dataset,correctColumn)
if(showWarnings && sum(useColumns) < ncol(dataset))
  pbiWarning <- "Some columns are not numeric, or constant"

dataset <- as.data.frame(dataset[,useColumns])
nc <- ncol(dataset)
nr <- nrow(dataset)

#PBI_COMMENT: re-define addrect to avoid errors in input
if(!is.null(addrect))
{
  if((is.na(addrect)||!is.numeric(addrect)||addrect < 0) && !is.null(nc))
    addrect=autoDetectAddrect(dataset)
  
  addrect <- max(1, min(round(addrect), nc))
  if(order == 'hclust' && addrect > 1) #enable adding rectangle by type=full
    type <- 'full'
}

##############Main Visualization script###########

#PBI_COMMENT: Create visual
if(nc > 1 && nr > 1){
  #PBI_COMMENT: compute correlation matrix, allow for missing values
  M <- cor(dataset, use="pairwise.complete.obs")
  corrplot(M, method=method, order=order, type=type, addrect=addrect,
           mar = defMar, tl.col = tl.col, tl.cex=tl.cex,
           number.digits=number.digits, number.cex=number.cex, addCoef.col=addCoef.col)
}else{ #empty correlation plot
  plot.new()
  pbiWarning<-paste(pbiWarning, "Not enough input dimensions", sep="\n")
}
#add warning as subtitle
if(showWarnings)
  title(main = NULL, sub = pbiWarning, outer = FALSE, col.sub = "gray50", cex.sub = 0.75)
