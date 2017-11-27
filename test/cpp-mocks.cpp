#include "gmock/gmock.h"

class MockStuff : public Stuff {
public:

    // https://github.com/google/googletest/blob/master/googlemock/docs/CookBook.md#making-the-compilation-faster
    MockStuff ();

    virtual ~MockStuff();

    MOCK_METHOD0(test, void());

    MOCK_METHOD0(fn1, void());

    MOCK_METHOD0(fn2, void());

    MOCK_METHOD2(multTwo, int(int a, int b));

    MOCK_METHOD2(addTwo, int(int a, int b));

    MOCK_METHOD3(addThree, int(int a, int b, int c));
};
