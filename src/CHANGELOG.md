# Changelog

All notable changes done to this project are mentioned in this file.

## Task

- To create a reusable FilterBarComponent that can be used across different modules with customizable filter options and pagination support.
- Implement pagination logic in the component to calculate the current page index based on the filter's skip and limit values.

## solution

- I have implemented the FilterBarComponent using Angular Material.
- I created separate service to hande the dynamic filter configuration.
- I have also created a reusable PaginationBarComponent ho handle the pagination logic seprately.

## Testing

- code has been tested for the Filteration based on Name, Type, Currency and isPrivate
- Specific testing done for the dynamic filter configuration service to ensure it returns the correct filter options based on the provided configuration.
- selecting and deselecting values of the filter options.
- clearing the filter options and reseting the list to its original form
- Pagination logic has been tested for different page sizes and current page indices.
- changing the Items per page, total count of items and current page index.
- moving across the different pages
- Testing the integration of the FilterBarComponent with the PaginationBarComponent to ensure they work together seamlessly.
