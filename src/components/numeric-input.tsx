import {
   InputGroup,
   InputLeftAddon,
   NumberDecrementStepper,
   NumberIncrementStepper,
   NumberInput,
   NumberInputField,
   NumberInputStepper,
   Text,
   useUpdateEffect,
   VStack
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface NumericInputProps {
   min: number;
   max: number;
   initialValue: string;
   onChange: (val: number) => void;
   placeholder: string;
   changeProhibited: boolean;
   prohibitedErrorMessage?: string;
   outOfRangeErrorMessage?: string;
   resetCounter: number;
}
export const NumericInput: React.FC<NumericInputProps> = ({
   min,
   max,
   initialValue,
   onChange,
   placeholder,
   changeProhibited,
   prohibitedErrorMessage = 'Changing is prohibited.',
   outOfRangeErrorMessage = `Choose between ${min} and ${max}`,
   resetCounter
}) => {
   const [outOfRange, setOutOfRange] = useState(false);
   const [prohibitedAttempt, setProhibitedAttempt] = useState(false);
   const [value, setValue] = useState(initialValue);

   //if the value is ever greater than the max when the max changes, set the value to the max to stay in range
   useUpdateEffect(() => {
      if (parseInt(value, 10) > max) {
         setValue(max.toString());
      }
   }, [max]);

   useUpdateEffect(() => {
      //any changes to the reset counter are a message to reset errors
      setOutOfRange(false);
      setProhibitedAttempt(false);
   }, [resetCounter]);

   const isValid = (val: string) => {
      const int = parseInt(val, 10);
      return !(!int || int > max || int < min);
   };

   const handleChange = (val: string) => {
      setValue(val);

      const valid = isValid(val);

      setOutOfRange(!valid);

      if (valid) {
         if (changeProhibited) {
            setProhibitedAttempt(true);
         } else {
            //can safely parse new value and pass to on change
            onChange(parseInt(val, 10));
         }
      }
   };
   return (
      <VStack>
         <InputGroup alignSelf='center'>
            <InputLeftAddon children={placeholder} />
            <NumberInput
               maxW={32}
               min={min}
               max={max}
               value={value}
               onChange={handleChange}
               placeholder={placeholder}
               isDisabled={changeProhibited}
               onClick={() => {
                  if (changeProhibited) {
                     setProhibitedAttempt(true);
                  }
               }}
            >
               <NumberInputField
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
               />
               <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
               </NumberInputStepper>
            </NumberInput>
         </InputGroup>
         {prohibitedAttempt && (
            <Text maxW={220} fontSize={'sm'} color={'red.500'}>
               {prohibitedErrorMessage}
            </Text>
         )}
         {outOfRange && (
            <Text maxW={220} color={'red.500'}>
               {outOfRangeErrorMessage}
            </Text>
         )}
      </VStack>
   );
};
