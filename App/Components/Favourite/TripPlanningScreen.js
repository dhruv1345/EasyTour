import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const TripPlanningScreen = ({ history }) => {
  const [days, setDays] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [tripSuggestions, setTripSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = "sk-RGMxpZqk7n36Su0DshLAKSHYA2LT3BlbkFJ8b9amlodfhTnLKHiNFci";
  const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

  const handleNext = async () => {
    
    if (!days || !location || !budget) {
      alert('Please fill in all fields');
      return;
    }

    const prompt = `I want to go on a ${days} day trip to ${location} and my budget is ${budget} ruppees. Here are some places to visit in a :\n\n`;

    setIsLoading(true);

    try {
      const response = await axios.post(
        apiUrl,
        {
          prompt: prompt,
          max_tokens: 1024,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const botResponse = response.data.choices[0].text;

      // Split the response into lines to create a list of suggestions
      const suggestions = botResponse.split('\n');

      // Filter out any empty lines
      const filteredSuggestions = suggestions.filter((suggestion) => suggestion.trim() !== '');

      setTripSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error getting trip suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.botText}>Disha👩‍💻: Let's plan your trip!</Text>
      <TextInput
        style={styles.input}
        placeholder="Number of days"
        value={days}
        onChangeText={setDays}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Budget"
        value={budget}
        onChangeText={setBudget}
      />

      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      {isLoading && <Text style={styles.loadingText}>Loading suggestions...</Text>}

      {tripSuggestions.length > 0 && (
        <ScrollView>
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsHeader}>Trip Suggestions:</Text>
            {tripSuggestions.map((suggestion, index) => (
              <Text key={index} style={styles.suggestion}>
                {suggestion}
              </Text>
            ))}
          </View>
        </ScrollView>
      )}

      <TouchableOpacity onPress={history} style={styles.backButton}>
        <Text style={styles.buttonText}>Back to Start</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  botText: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 20,
  },
  suggestionsContainer: {
    marginTop: 20,
  },
  suggestionsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  suggestion: {
    fontSize: 16,
    marginBottom: 5,
  },
  backButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default TripPlanningScreen;