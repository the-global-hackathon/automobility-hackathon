/* Inside of here, we're going to write out some amount of logic that's going to
start up the process of requesting permission to a track user's location, do the
error handling, and then start watching for a user's change in location. */
import { useState, useEffect} from 'react';
import { Accuracy, requestPermissionsAsync, watchPositionAsync } from 'expo-location';
// anytime we use this hook(useLocation()), we'll pass in a boolean value as the first argument(shouldTrack/isFocused).
// if the boolean value is true, we're going to re-run the function inside of useEffect.
export default (shouldTrack, callback) => { // "shouldTrack" is "isFocused" in TrackCreateScreen
  const [err, setErr] = useState(null);



  /* Remember this hook("useEffect") gets executed every time TrackCreateScreen
  re-renders.
  Every time our hook is executed, react is going to look at the value inside
  the array("shouldTrack") and it's going to compare that value to the last time
  our hook ran. Between these two times of our hook running, if that value changes
  then react is going to run the function inside useEffect an additional time.
  So we can use "shouldTrack" to decide whether we want to start watching or stop
  watching.*/
  useEffect(() => {
    /*NOTE: There is a better way to handle the subscriber variable than using:
    // const [subscriber, setSubscriber] = useState(null);
    Because there is NO reason to re-render our component whenever we get a "subscriber"
    back. Becasue we only get "subscriber" once we start watching for a user's location,
    we don't show or consume that subscriber in any way inside of a component and in fact
    is 100 percent localized to our hook.
    As an alternitave way to handle this, we're going to delete "const [subscriber, setSubscriber] = useState(null)"
    and add "let subscriber;" inside of "startWatching". We then remove "const" from "sub"
    and delete "setSubscriber(sub)". Finally, inside of use effect, we'll delete "setSubscriber(sub)"
    and replace it with "subscriber = null" - Also see "Avoiding Stale References" document
    */
    let subscriber;
    const startWatching = async () => {
      try {
        // request location
        await requestPermissionsAsync();

        /* NOTE: Whenever we call watchPositionAsync, this is going to eventually give us back a value
        called "subscriber" and on this value, there is a function called remove. The "remove" function
        is what is going to actually make sure that we stop tracking the user's location.*/
        // If we want to stop watching a user's location, we would call "subscriber.remove()"

        // watch the user's location and see it change overtime
        /*const*/ subscriber = await watchPositionAsync(
          {
            /* we can go anywhere from a accuracy of like 1 to 5 kilometers all the way down
            to like a meter. The higher accuracy, the more battery power it's going to take.
            We will use high accuracy(BestForNavigation).*/
            accuracy: Accuracy.BestForNavigation,
            // we're going to an update once every second
            timeInterval: 1000,
            // get a update once every 10 meters
            // NOTE: once every second OR once every 10 meters
            distanceInterval: 10
          },
          // anytime we get a position update, we're going to call callback.
          callback
          // This callback get called anytime we see a new location
          // (location) => { // "location" describes the user's actual location
          //   addLocation(location);
          //});
        );
        /* By passing "sub" into "setSubscriber", we now hav access to our subscriber
        object inside the "subscriber" variable. */
        // setSubscriber(sub); - removed for refactor
      } catch (e) {
        setErr(e);
      }
    }


    if (shouldTrack) {
      startWatching();
    } else {
      if (subscriber) {
        // stop watching
        subscriber.remove();
      }
      /* After we stop watching, we're going to use setSubscriber to set our "subscriber"
      piece of state back null which indicates we don't have a subscriber so we don't
      have anything to stop.*/
      // setSubscriber(null); - refactored to "subscriber = null"
      subscriber = null
    }

    /* We're going to use this function to stop listening for changes to the user's
    location before we start listening a second time.*/
    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
    /* NOTE: If we we're to pass in an empty array as an argument to useEffect that
    means we want to run the function once when the component first shows on the screen.*/
  }, [shouldTrack, callback]);


  /* NOTE: The only reason that we return an array right here is that we might want
  to eventually return multiple different values.
  There is nothing special about returning an array, that's just the
  convention of hooks.*/
  return [err];
}
