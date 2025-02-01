# Daily Sales Forecasting Application

This React application allows users to forecast daily sales using at least 40 days of historical data. The app integrates with a backend prediction API to generate forecasts for the next 20 days.

## Features

- **Historical Data Input**: Users can input at least 40 comma-separated values of historical sales data.
- **Sample Data Usage**: Predefined sample datasets are available for demonstration purposes.
- **Interactive Line Chart**: Visualizes both historical and predicted sales trends.
- **Forecast Summary**: Provides average, highest, and lowest predicted sales over the forecast period.

## Installation & Setup

To get started with the project, follow the instructions below:

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   - Ensure you have a `.env` file in your project root.
   - Set the URL for your backend prediction API:
     ```
     VITE_API_URL=http://your-api-url/predict
     ```

4. **Run the Application**
   ```bash 
   npm start
   ```

5. **Access the Application**

   Open your browser and navigate to `http://localhost:3000` to view the app.

## Usage Instructions

1. **Enter Historical Data**

   - Paste at least 40 comma-separated values into the text area provided.
   - Alternatively, click "Use sample data_1", "Use sample data_2", or "Use sample data_3" to load predefined datasets.

2. **Generate Forecast**

   - Click the "Generate Forecast" button to calculate predictions.
   - The app will display an interactive line chart showing historical sales trends and future predictions.

3. **View Forecast Summary**

   - Check average, highest, and lowest sales predictions for the next 20 days in the summary section.

## Technologies Used

- **Frontend**: React, TypeScript, Recharts for charting, Tailwind CSS for styling.
- **Icons**: Lucide React.

## Error Handling

In case of errors during prediction fetching, ensure that:

- The backend server is running and accessible.
- The `VITE_API_URL` is correctly set in the `.env` file.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---
