# load required packages
library(readr)
library(dplyr)
library(seasonal)

# load background check data
checks <- read_csv("182/csv/nics-firearm-background-checks.csv") 

# apply Jurgen Brauer's sales estimation method
estimates <- checks %>%
  mutate(est_multiple = ifelse(state=="California",0,2*multiple),
         est_handgun = 1.1*handgun,
         est_long_gun = 1.1*long_gun,
         est_other = 1.1*other)
estimates$estimate = rowSums(estimates[,c("est_multiple","est_handgun","est_long_gun","est_other","private_sale_handgun","private_sale_long_gun","private_sale_other")], na.rm=TRUE)

# calculate national totals by month 
estimates_summary <- estimates %>%
  group_by(month) %>%
  summarize(estimate = sum(estimate))

# create time series 
estimates_summary_ts <- ts(estimates_summary$estimate, start=c(2012,01), end=c(2017,10), frequency=12)
estimates_summary_ts <- window(estimates_summary_ts, start=c(2012,01), end=c(2017,10))

# # make seasonal adjustment, convert to data frame 
# estimates_summary_seas <- seas(estimates_summary_ts)
# estimates_seas <- as.data.frame(estimates_summary_seas) 
# # change dates to reflect the last day of each month rather than the first
# estimates_seas <- estimates_seas %>%
#   mutate(date = seq(as.Date("2012-01-01"), by="1 month", len=nrow(estimates_seas))-1)

print(estimates_summary_ts)