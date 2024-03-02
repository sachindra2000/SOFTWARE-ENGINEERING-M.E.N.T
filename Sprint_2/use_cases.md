# Use Cases for Population Data Application

## Use Case 1: View Countries by Population Ranking

**Actor**: Analyst

**Goal**: To view a sorted list of countries based on population.

**Preconditions**: Analyst is logged in with sufficient permissions.

**Main Flow**:
1. Analyst requests a population ranking report from the dashboard.
2. System displays the report sorted by country populations from highest to lowest.

**Alternative Flows**:
A. In case of a system error, the system shows an error message, and the analyst is prompted to retry.

**Frequency of Occurrence**: Potentially multiple times daily.

## Use Case 2: Access City Data by Demographic

**Actor**: Researcher

**Goal**: To access sorted demographic data of cities.

**Preconditions**: Researcher is logged in with sufficient permissions.

**Main Flow**:
1. Researcher selects the option to view city demographic data.
2. System displays cities sorted by population within the specified filters.

**Alternative Flows**:
A. If no data is available, the system notifies the researcher.

**Frequency of Occurrence**: As needed for research activities.

## Use Case 3: Access Capital Cities Report

**Actor**: Geography Teacher

**Goal**: To access a list of capital cities sorted by population.

**Preconditions**: Geography Teacher has access to the system.

**Main Flow**:
1. Teacher requests a report of capital cities in a region.
2. System displays the report organized by population size.

**Alternative Flows**:
A. If the region specified has no capital cities, inform the teacher.

**Frequency of Occurrence**: Occasionally, as needed for curriculum planning.

## Use Case 4: Generate Dynamic Population Reports

**Actor**: Policy Planner

**Goal**: To create reports for the top N populated entities.

**Preconditions**: Policy Planner is logged in with permissions to generate reports.

**Main Flow**:
1. Policy Planner inputs the value for 'N' to generate a report.
2. System processes and displays the top N populated countries or cities.

**Alternative Flows**:
A. If the input 'N' is invalid, prompt the planner to enter a valid number.

**Frequency of Occurrence**: Regularly, during strategic planning sessions.

## Use Case 5: Language Speakers Data Access

**Actor**: Cultural Research Team Member

**Goal**: To obtain data on the number of language speakers.

**Preconditions**: Research Team Member is authenticated in the system.

**Main Flow**:
1. Team Member selects to view language speakers data.
2. System provides the number and percentage of speakers for selected languages.

**Alternative Flows**:
A. If data is unavailable, the system indicates so to the team member.

**Frequency of Occurrence**: Periodically, ahead of cultural events.

## Use Case 6: Secure Data Management

**Actor**: Database Administrator

**Goal**: To manage population data securely.

**Preconditions**: Database Administrator has system access with high-level permissions.

**Main Flow**:
1. Administrator chooses to add, update, or delete data.
2. System processes the changes securely and updates records.

**Alternative Flows**:
A. If unauthorized changes are attempted, the system denies access and logs the attempt.

**Frequency of Occurrence**: As needed for data maintenance.

## Use Case 7: Urbanization Trend Analysis

**Actor**: Government Liaison

**Goal**: To analyze urbanization trends through population reports.

**Preconditions**: Government Liaison has the required system access.

**Main Flow**:
1. Liaison selects to view urban vs. rural population reports.
2. System displays the requested data for specified countries.

**Alternative Flows**:
A. If the data is not up-to-date, the system indicates the last update timestamp.

**Frequency of Occurrence**: Regularly for planning meetings.

## Use Case 8: Secure Report Access

**Actor**: Organization Employee

**Goal**: To securely access sensitive population reports.

**Preconditions**: Employee has valid login credentials.

**Main Flow**:
1. Employee logs in to access reports.
2. System verifies credentials and grants access to requested reports.

**Alternative Flows**:
A. If login fails, the system denies access and offers password reset.

**Frequency of Occurrence**: Daily, as part of regular job functions.