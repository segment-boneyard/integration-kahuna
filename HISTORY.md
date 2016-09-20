
1.0.17 / 2016-05-05
===================

  * fix uncaught exception

1.0.16 / 2016-05-03
===================

  * add guard clause in case userAgent or context.app are undefined

1.0.15 / 2016-05-03
===================

  * support push tokens and browser name

1.0.14 / 2016-04-20
===================

  * fix uncaught exceptions && prune null values (#14)

1.0.13 / 2016-04-20
===================

  * flatten compound objects

1.0.12 / 2016-04-13
===================

  * stringify properties for intelligent events (#11)

1.0.11 / 2016-03-14
===================

  * properly send user and event data

1.0.10 / 2015-12-17
===================

  * Re-include option to create dev_id from email in absence of user_id, associated test fix up, whitespace
  * Map username if available in both identify() and track()
  * Switch from username to user_id as primary credential in identify and track

1.0.9 / 2015-09-30
==================

  * Update os name mappings

1.0.8 / 2015-09-30
==================

  * Map iPhone OS (as sent by our iOS library) to simply iOS

1.0.7 / 2015-08-27
==================

  * Updated Kahuna server integration to generate a dev_id from username or email if the context doesn't have a dev_id already.


1.0.5 / 2015-02-04
==================

  * Stringify user_info dict
  * Update circle template

1.0.4 / 2015-02-03
==================

  * Removed ensure for boolean setting var

1.0.3 / 2015-02-02
==================

 * Update segmentio-integration

1.0.2 / 2015-01-30
==================

  * Changing Key Name

1.0.1 / 2014-12-16
==================

  * Added production option

1.0.0 / 2014-12-12
==================

 * Initial release
