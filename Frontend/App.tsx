import React from 'react'
import { View, Text } from 'react-native'

export default function App() {
  return (
    <View>
      <Text className='bg-primary-fixed'>Soy un texto con color cafe</Text>
    </View>
  )
}

const styles = {
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
}
